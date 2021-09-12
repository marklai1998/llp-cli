import { GroupJobStatus } from "./constants/groupDeployStatus";
import { listAvailablePackages } from "./services/llp/listAvailablePackages";
import { getEnv } from "./configs/index";
import { getServicesInfo } from "./services/llp/getServiceInfo";
import { isEmpty, pluck, split, values } from "ramda";
import { listServices } from "./services/llp/listServices";
import { packageService } from "./services/llp/packageService";
import { listServiceGitHistory } from "./services/llp/listServiceGitHistory";
import { getDefaultBranch } from "./constants/env";
import { getPackageStatus } from "./services/llp/getPackageStatus";
import { PackageStatus } from "./constants/packageStatus";
import { sleep } from "./utils/sleep";
import { Action } from "vorpal";
import { deployPackageToK8s } from "./services/llp/deployPackageToK8s";
import { getK8sDeployStatus } from "./services/llp/getK8sDeployStatus";
import { K8sDeployStatus } from "./constants/k8sDeployStatus";
import { getK8sInfo } from "./services/llp/getK8sInfo";
import clc from "cli-color";
import { doneMsg, errorMsg } from "./utils/console";
import { Timer } from "timer-node";
import Multispinner from "multispinner";
import { dots } from "cli-spinners";
import { deployPackageToNodeGroup } from "./services/llp/deployPackageToNodeGroup";
import { getNodeGroupDeployStatus } from "./services/llp/getNodeGroupDeployStatus";
import { getNodeGroupInfo } from "./services/llp/getNodeGroupInfo";
import { Package } from "./types/package";

const spinnerOptions = {
  ...dots,
  clear: true,
};

const build = async ({
  serviceId,
  branch,
}: {
  serviceId: number;
  branch: string;
}) => {
  const timer = new Timer({ label: "build" });
  timer.start();

  const { job_id, git_link } = await getServicesInfo({ serviceId });

  const history = await listServiceGitHistory({
    serviceId,
    gitLink: git_link,
    branch: branch,
  });

  if (isEmpty(history)) {
    console.log(clc.bgRed("Error"), "Empty git history");
    return;
  }

  const deployCommit = history[0];

  console.log("Target branch:", branch);

  const [, description] = split(" - ", deployCommit);
  console.log("Packaging:", deployCommit.replace(/(\r\n|\n|\r)/gm, "") + "\n");

  const { build_id } = await packageService({
    jobId: Number(job_id),
    version: deployCommit,
    description,
  });

  await new Promise<void>(async (resolve, reject) => {
    const { step } = await getPackageStatus({ buildId: build_id });

    const packageSpinnerStage = step.reduce(
      (acc, { name, cn_name }) => ({ ...acc, [name]: cn_name }),
      {}
    );

    const packageSpinnies = new Multispinner(
      packageSpinnerStage,
      spinnerOptions
    );

    packageSpinnies.on("done", async () => {
      const { status } = await getPackageStatus({ buildId: build_id });

      if (status === PackageStatus.FAILED) {
        errorMsg("Package Failed");
        return reject();
      }

      resolve();
    });

    packageSpinnies.on("error", reject);

    while (true) {
      await sleep(5000);

      const { status, step } = await getPackageStatus({ buildId: build_id });

      step.forEach(({ status, name }) => {
        switch (String(status)) {
          case PackageStatus.FAILED:
            packageSpinnies.error(name);
          case PackageStatus.FINISHED:
            packageSpinnies.success(name);
        }
      });

      if (
        status !== PackageStatus.RUNNING &&
        status !== PackageStatus.PENDING
      ) {
        step.forEach(({ name }) => {
          packageSpinnies.success(name);
        });
      }
    }
  });

  doneMsg(`Packaged successfully in ${timer.ms()}ms`);
  timer.stop();
};

const deployK8s = async ({
  serviceId,
  deployPackage,
}: {
  serviceId: number;
  deployPackage: Package;
}) => {
  const timer = new Timer({ label: "deployK8s" });
  timer.start();

  const {
    appInfo: { id: k8sId },
  } = await getK8sInfo({ serviceId });

  console.log("Deploying(k8s): ", deployPackage.filename + "\n");

  const { rel_id: deploymentId } = await deployPackageToK8s({
    serviceId,
    k8sId: Number(k8sId),
    packageId: Number(deployPackage.package_id),
  });

  await new Promise<void>(async (resolve, reject) => {
    const { stage } = await getK8sDeployStatus({ deploymentId });

    const deploySpinnerStage = stage.reduce(
      (acc, { name, stage }) => ({ ...acc, [stage]: name }),
      {}
    );

    const deploySpinnies = new Multispinner(deploySpinnerStage, spinnerOptions);

    deploySpinnies.on("done", async () => {
      const { info } = await getK8sDeployStatus({ deploymentId });

      if (info.status === K8sDeployStatus.FAILED) {
        errorMsg("Deploy Failed");
        return reject();
      }

      resolve();
    });

    deploySpinnies.on("error", reject);

    while (true) {
      await sleep(5000);

      const { info, stage } = await getK8sDeployStatus({ deploymentId });

      stage.forEach(({ status, stage }) => {
        switch (String(status)) {
          case K8sDeployStatus.FAILED:
            deploySpinnies.error(stage);
          case K8sDeployStatus.FINISHED:
            deploySpinnies.success(stage);
        }
      });

      if (
        info.status !== K8sDeployStatus.RUNNING &&
        info.status !== K8sDeployStatus.PENDING
      ) {
        stage.forEach(({ stage }) => {
          deploySpinnies.success(stage);
        });
      }
    }
  });

  doneMsg(`Deployed k8s successfully in ${timer.ms()}ms`);
  timer.stop();
};

const deployNodeGroup = async ({
  serviceId,
  deployPackage,
}: {
  serviceId: number;
  deployPackage: Package;
}) => {
  const timer = new Timer({ label: "deployNodeGroup" });
  timer.start();

  const { node_list } = await getNodeGroupInfo({ serviceId });

  if (isEmpty(node_list)) {
    errorMsg("Empty node list");
    return;
  }

  console.log("Deploying(node group): ", deployPackage.filename + "\n");

  const nodeIds = pluck("id", values(node_list)).map(Number);

  const { rel_id: deploymentId } = await deployPackageToNodeGroup({
    serviceId,
    nodeIds,
    packageId: Number(deployPackage.package_id),
  });

  const { rel_node_list } = await getNodeGroupDeployStatus({ deploymentId });

  const deploySpinnerStage = rel_node_list.reduce(
    (acc, { node_info: { host } }) => ({ ...acc, [host]: host }),
    {}
  );

  await new Promise<void>(async (resolve, reject) => {
    const deploySpinnies = new Multispinner(deploySpinnerStage, {
      ...dots,
      clear: true,
    });

    deploySpinnies.on("done", async () => {
      const {
        rel_record_info: { status },
      } = await getNodeGroupDeployStatus({ deploymentId });

      if (status === GroupJobStatus.FAILED) {
        errorMsg("Deploy Failed");
        return reject();
      }

      resolve();
    });

    deploySpinnies.on("error", reject);

    while (true) {
      await sleep(5000);

      const { rel_node_list, rel_record_info } = await getNodeGroupDeployStatus(
        {
          deploymentId,
        }
      );

      rel_node_list.forEach(({ node_info: { host, status } }) => {
        switch (String(status)) {
          case GroupJobStatus.FAILED:
            deploySpinnies.error(host);
          case GroupJobStatus.FINISHED:
            deploySpinnies.success(host);
        }
      });

      if (
        rel_record_info.status !== GroupJobStatus.RUNNING &&
        rel_record_info.status !== GroupJobStatus.PENDING
      ) {
        rel_node_list.forEach(({ node_info: { host, status } }) => {
          deploySpinnies.success(host);
        });
      }
    }
  });

  doneMsg(`Deployed node group successfully in ${timer.ms()}ms`);
  timer.stop();
};

export const deploy: Action = async ({
  serviceName,
  options: { branch = getDefaultBranch(getEnv()), node, all },
}: any) => {
  const timer = new Timer({ label: "deploy" });
  timer.start();

  const serviceList = await listServices({ name: serviceName });

  if (isEmpty(serviceList.list)) {
    errorMsg("unknown service");
    return;
  }

  const { id, service } = serviceList.list[0];
  const serviceId = Number(id);
  console.log("Deploy service:", service);

  await build({ serviceId, branch });

  await sleep(3000);

  const { list: packageList } = await listAvailablePackages({ serviceId });

  if (isEmpty(packageList)) {
    errorMsg("Empty package list");
    return;
  }

  const deployPackage = packageList[0];

  if (node) {
    await deployNodeGroup({ serviceId, deployPackage });
  } else {
    try {
      await getK8sInfo({ serviceId });

      await deployK8s({ serviceId, deployPackage });
      if (all) {
        await deployNodeGroup({ serviceId, deployPackage });
      }
    } catch (e) {
      // fallback to group deploy when k8s is not available
      await deployNodeGroup({ serviceId, deployPackage });
    }
  }

  doneMsg(`Deploy completed in ${timer.ms()}ms`);
  timer.stop();
};

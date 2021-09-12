import { listK8sPackages } from "./services/llp/listK8sPackages";
import { getEnv } from "./configs/index";
import { getServicesInfo } from "./services/llp/getServiceInfo";
import { isEmpty, split } from "ramda";
import { listServices } from "./services/llp/listServices";
import { packageService } from "./services/llp/packageService";
import { listServiceGitHistory } from "./services/llp/listServiceGitHistory";
import { getDefaultBranch } from "./constants/env";
import { getPackageStatus } from "./services/llp/getPackageStatus";
import { PackageStatus } from "./constants/packageStatus";
import { sleep } from "./utils/sleep";
import { Action } from "vorpal";
import { deployK8sPackage } from "./services/llp/deployK8sPackage";
import { getK8sDeployStatus } from "./services/llp/getK8sDeployStatus";
import { K8sDeployStatus } from "./constants/k8sDeployStatus";
import { getK8sInfo } from "./services/llp/getK8sInfo";
import clc from "cli-color";
import { doneMsg, errorMsg } from "./utils/console";
import { Timer } from "timer-node";
import Multispinner from "multispinner";
import { dots } from "cli-spinners";

const build = async ({ id }: { id: number }) => {
  const { job_id, git_link } = await getServicesInfo({ id: Number(id) });

  const targetBranch = getDefaultBranch(getEnv());

  const history = await listServiceGitHistory({
    id: Number(id),
    gitLink: git_link,
    branch: targetBranch,
  });

  if (isEmpty(history)) {
    console.log(clc.bgRed("Error"), "Empty git history");
    return;
  }

  const deployCommit = history[0];

  console.log("Target branch:", targetBranch);

  const [, description] = split(" - ", deployCommit);
  console.log("Packaging:", deployCommit.replace(/(\r\n|\n|\r)/gm, "") + "\n");

  const { build_id } = await packageService({
    jobId: Number(job_id),
    version: deployCommit,
    description,
  });

  await new Promise<void>(async (resolve, reject) => {
    const { step } = await getPackageStatus({ buildId: build_id });

    const packageSpinnerStage = step.reduce((acc, { name, cn_name }) => {
      return { ...acc, [name]: cn_name };
    }, {});

    const packageSpinnies = new Multispinner(packageSpinnerStage, {
      ...dots,
    });

    packageSpinnies.on("done", async () => {
      const { status } = await getPackageStatus({ buildId: build_id });

      if (status === PackageStatus.FAILED) {
        errorMsg("Package Failed");
        reject();
      }
      if (status === PackageStatus.FINISHED) {
        resolve();
      }
    });

    packageSpinnies.on("error", () => {
      reject();
    });

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
};

const deployK8s = async ({ id }: { id: number }) => {
  const { list: packageList } = await listK8sPackages({ id: id });

  if (isEmpty(packageList)) {
    errorMsg("Empty package list");
    return;
  }

  const deployPackage = packageList[0];

  console.log("Deploying: ", deployPackage.filename + "\n");

  const {
    appInfo: { id: k8sId },
  } = await getK8sInfo({ id: Number(id) });

  const { rel_id } = await deployK8sPackage({
    id: id,
    k8sId: Number(k8sId),
    packageId: Number(deployPackage.package_id),
  });

  await new Promise<void>(async (resolve, reject) => {
    const { stage } = await getK8sDeployStatus({
      deploymentId: rel_id,
    });

    const deploySpinnerStage = stage.reduce((acc, { name, stage }) => {
      return { ...acc, [stage]: name };
    }, {});

    const deploySpinnies = new Multispinner(deploySpinnerStage, {
      ...dots,
    });

    deploySpinnies.on("done", async () => {
      const { info } = await getK8sDeployStatus({
        deploymentId: rel_id,
      });

      if (info.status === K8sDeployStatus.FAILED) {
        errorMsg("Deploy Failed");
        reject();
      }
      if (info.status === K8sDeployStatus.FINISHED) {
        resolve();
      }
    });

    deploySpinnies.on("error", () => {
      reject();
    });

    while (true) {
      await sleep(5000);

      const { info, stage } = await getK8sDeployStatus({
        deploymentId: rel_id,
      });

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
};

export const deploy: Action = async ({ serviceName }: any) => {
  const timer = new Timer({ label: "test-timer" });
  timer.start();

  const serviceList = await listServices({ name: serviceName });

  if (isEmpty(serviceList.list)) {
    console.log(clc.bgRed("Error"), "unknown service");
    return;
  }

  const { id, service } = serviceList.list[0];

  await build({ id: Number(id) });

  console.log("\n");
  doneMsg(`Packaged successfully in ${timer.ms()}ms`);

  console.log("Deploy service:", service);

  timer.clear();
  timer.start();

  await sleep(3000);

  await deployK8s({ id: Number(id) });

  console.log("\n");
  doneMsg(`Deployed successfully in ${timer.ms()}ms`);

  doneMsg("Deploy completed");
  timer.stop();
};

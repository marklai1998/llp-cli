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
import { Vorpal } from "./vorpalInstance";
import { Action } from "vorpal";
import { EnumValues } from "enum-values";
import { deployK8sPackage } from "./services/llp/deployK8sPackage";
import { getK8sDeployStatus } from "./services/llp/getK8sDeployStatus";
import { K8sDeployStatus } from "./constants/k8sDeployStatus";
import { getK8sInfo } from "./services/llp/getK8sInfo";

export const deploy: Action = async ({
  serviceName,
}: {
  serviceName: string;
  options: {};
}) => {
  const serviceList = await listServices({ name: serviceName });

  if (isEmpty(serviceList.list)) {
    console.log("unknown service");
    return;
  }

  const { id, service } = serviceList.list[0];
  const { job_id, git_link } = await getServicesInfo({ id: Number(id) });

  console.log("Deploy service:", service);

  const history = await listServiceGitHistory({
    id: Number(id),
    gitLink: git_link,
    branch: getDefaultBranch(getEnv()),
  });

  if (isEmpty(history)) {
    console.log("empty git history");
    return;
  }

  const deployCommit = history[0];

  console.log("Packaging:", deployCommit.replace(/(\r\n|\n|\r)/gm, ""));

  const [hash, description] = split(" - ", deployCommit);

  const { build_id } = await packageService({
    jobId: Number(job_id),
    version: deployCommit,
    description,
  });

  while (true) {
    const { status, step } = await getPackageStatus({ buildId: build_id });

    if (status >= PackageStatus.FINISHED) {
      break;
    }

    const statusString = step.reduce(
      (acc, { name, status }) =>
        acc +
        `${name}: ${
          EnumValues.getNamesAndValues(PackageStatus).find(
            ({ value }) => value === String(status)
          )?.name
        }\n`,
      ""
    );

    Vorpal.ui.redraw(statusString);

    await sleep(5000);
  }

  const { status } = await getPackageStatus({ buildId: build_id });

  if (status === PackageStatus.FAILED) {
    console.log("Package Failed");
    return;
  }

  console.log("Finish Package");

  await sleep(3000);

  const { list: packageList } = await listK8sPackages({ id: Number(id) });

  if (isEmpty(history)) {
    console.log("empty package list");
    return;
  }

  const deployPackage = packageList[0];

  console.log("Deploying:", deployPackage.filename);

  const {
    appInfo: { id: k8sId },
  } = await getK8sInfo({ id: Number(id) });

  const { rel_id } = await deployK8sPackage({
    id: Number(id),
    k8sId: Number(k8sId),
    packageId: Number(deployPackage.package_id),
  });

  while (true) {
    const { info, stage } = await getK8sDeployStatus({
      deploymentId: rel_id,
    });

    if (
      info.status !== K8sDeployStatus.RUNNING &&
      info.status !== K8sDeployStatus.PENDING
    ) {
      break;
    }

    const statusString = stage.reduce(
      (acc, { name, status }) =>
        acc +
        `${name}: ${
          EnumValues.getNamesAndValues(K8sDeployStatus).find(
            ({ value }) => value === String(status)
          ).name
        }\n`,
      ""
    );

    Vorpal.ui.redraw(statusString);

    await sleep(5000);
  }

  const { info } = await getK8sDeployStatus({
    deploymentId: rel_id,
  });

  if (info.status === K8sDeployStatus.FAILED) {
    console.log("Deploy Failed");
    return;
  }

  console.log("Deploy Successfully");
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deploy = void 0;
const listK8sPackages_1 = require("./services/llp/listK8sPackages");
const index_1 = require("./configs/index");
const getServiceInfo_1 = require("./services/llp/getServiceInfo");
const ramda_1 = require("ramda");
const listServices_1 = require("./services/llp/listServices");
const packageService_1 = require("./services/llp/packageService");
const listServiceGitHistory_1 = require("./services/llp/listServiceGitHistory");
const env_1 = require("./constants/env");
const getPackageStatus_1 = require("./services/llp/getPackageStatus");
const packageStatus_1 = require("./constants/packageStatus");
const sleep_1 = require("./utils/sleep");
const deployK8sPackage_1 = require("./services/llp/deployK8sPackage");
const getK8sDeployStatus_1 = require("./services/llp/getK8sDeployStatus");
const k8sDeployStatus_1 = require("./constants/k8sDeployStatus");
const getK8sInfo_1 = require("./services/llp/getK8sInfo");
const cli_color_1 = __importDefault(require("cli-color"));
const console_1 = require("./utils/console");
const timer_node_1 = require("timer-node");
const multispinner_1 = __importDefault(require("multispinner"));
const cli_spinners_1 = require("cli-spinners");
const build = async ({ id }) => {
    const { job_id, git_link } = await (0, getServiceInfo_1.getServicesInfo)({ id: Number(id) });
    const targetBranch = (0, env_1.getDefaultBranch)((0, index_1.getEnv)());
    const history = await (0, listServiceGitHistory_1.listServiceGitHistory)({
        id: Number(id),
        gitLink: git_link,
        branch: targetBranch,
    });
    if ((0, ramda_1.isEmpty)(history)) {
        console.log(cli_color_1.default.bgRed("Error"), "Empty git history");
        return;
    }
    const deployCommit = history[0];
    console.log("Target branch:", targetBranch);
    const [, description] = (0, ramda_1.split)(" - ", deployCommit);
    console.log("Packaging:", deployCommit.replace(/(\r\n|\n|\r)/gm, "") + "\n");
    const { build_id } = await (0, packageService_1.packageService)({
        jobId: Number(job_id),
        version: deployCommit,
        description,
    });
    await new Promise(async (resolve, reject) => {
        const { step } = await (0, getPackageStatus_1.getPackageStatus)({ buildId: build_id });
        const packageSpinnerStage = step.reduce((acc, { name, cn_name }) => {
            return { ...acc, [name]: cn_name };
        }, {});
        const packageSpinnies = new multispinner_1.default(packageSpinnerStage, {
            ...cli_spinners_1.dots,
            clear: true,
        });
        packageSpinnies.on("done", async () => {
            const { status } = await (0, getPackageStatus_1.getPackageStatus)({ buildId: build_id });
            if (status === packageStatus_1.PackageStatus.FAILED) {
                (0, console_1.errorMsg)("Package Failed");
                reject();
            }
            if (status >= packageStatus_1.PackageStatus.FINISHED) {
                resolve();
            }
        });
        packageSpinnies.on("error", () => {
            reject();
        });
        while (true) {
            await (0, sleep_1.sleep)(5000);
            const { status, step } = await (0, getPackageStatus_1.getPackageStatus)({ buildId: build_id });
            step.forEach(({ status, name }) => {
                switch (String(status)) {
                    case packageStatus_1.PackageStatus.FAILED:
                        packageSpinnies.error(name);
                    case packageStatus_1.PackageStatus.FINISHED:
                        packageSpinnies.success(name);
                }
            });
            if (status !== packageStatus_1.PackageStatus.RUNNING &&
                status !== packageStatus_1.PackageStatus.PENDING) {
                step.forEach(({ name }) => {
                    packageSpinnies.success(name);
                });
            }
        }
    });
};
const deployK8s = async ({ id }) => {
    const { list: packageList } = await (0, listK8sPackages_1.listK8sPackages)({ id: id });
    if ((0, ramda_1.isEmpty)(packageList)) {
        (0, console_1.errorMsg)("Empty package list");
        return;
    }
    const deployPackage = packageList[0];
    console.log("Deploying: ", deployPackage.filename + "\n");
    const { appInfo: { id: k8sId }, } = await (0, getK8sInfo_1.getK8sInfo)({ id: Number(id) });
    const { rel_id } = await (0, deployK8sPackage_1.deployK8sPackage)({
        id: id,
        k8sId: Number(k8sId),
        packageId: Number(deployPackage.package_id),
    });
    await new Promise(async (resolve, reject) => {
        const { stage } = await (0, getK8sDeployStatus_1.getK8sDeployStatus)({
            deploymentId: rel_id,
        });
        const deploySpinnerStage = stage.reduce((acc, { name, stage }) => {
            return { ...acc, [stage]: name };
        }, {});
        const deploySpinnies = new multispinner_1.default(deploySpinnerStage, {
            ...cli_spinners_1.dots,
            clear: true,
        });
        deploySpinnies.on("done", async () => {
            const { info } = await (0, getK8sDeployStatus_1.getK8sDeployStatus)({
                deploymentId: rel_id,
            });
            if (info.status === k8sDeployStatus_1.K8sDeployStatus.FAILED) {
                (0, console_1.errorMsg)("Deploy Failed");
                reject();
            }
            if (info.status !== k8sDeployStatus_1.K8sDeployStatus.RUNNING &&
                info.status !== k8sDeployStatus_1.K8sDeployStatus.PENDING) {
                resolve();
            }
        });
        deploySpinnies.on("error", () => {
            reject();
        });
        while (true) {
            await (0, sleep_1.sleep)(5000);
            const { info, stage } = await (0, getK8sDeployStatus_1.getK8sDeployStatus)({
                deploymentId: rel_id,
            });
            stage.forEach(({ status, stage }) => {
                switch (String(status)) {
                    case k8sDeployStatus_1.K8sDeployStatus.FAILED:
                        deploySpinnies.error(stage);
                    case k8sDeployStatus_1.K8sDeployStatus.FINISHED:
                        deploySpinnies.success(stage);
                }
            });
            if (info.status !== k8sDeployStatus_1.K8sDeployStatus.RUNNING &&
                info.status !== k8sDeployStatus_1.K8sDeployStatus.PENDING) {
                stage.forEach(({ stage }) => {
                    deploySpinnies.success(stage);
                });
            }
        }
    });
};
const deploy = async ({ serviceName }) => {
    const timer = new timer_node_1.Timer({ label: "test-timer" });
    timer.start();
    const serviceList = await (0, listServices_1.listServices)({ name: serviceName });
    if ((0, ramda_1.isEmpty)(serviceList.list)) {
        console.log(cli_color_1.default.bgRed("Error"), "unknown service");
        return;
    }
    const { id, service } = serviceList.list[0];
    await build({ id: Number(id) });
    (0, console_1.doneMsg)(`Packaged successfully in ${timer.ms()}ms`);
    console.log("Deploy service:", service);
    timer.clear();
    timer.start();
    await (0, sleep_1.sleep)(3000);
    await deployK8s({ id: Number(id) });
    (0, console_1.doneMsg)(`Deployed successfully in ${timer.ms()}ms`);
    (0, console_1.doneMsg)("Deploy completed");
    timer.stop();
};
exports.deploy = deploy;
//# sourceMappingURL=deploy.js.map
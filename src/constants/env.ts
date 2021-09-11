export enum Env {
  PRD = 4,
  PRE = 5,
  STG = 2,
  DEV = 1,
}

export const getDefaultBranch = (env: Env) => {
  switch (env) {
    case Env.PRD:
      return "global/master";
    case Env.STG:
      return "global/stg";
    case Env.PRE:
      return "global/pre";
    default:
      return "global/stg";
  }
};

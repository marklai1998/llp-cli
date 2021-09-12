import clc from "cli-color";

export const errorMsg = (msg: string) => {
  console.log(clc.black.bgRed(" Error "), msg);
};

export const doneMsg = (msg: string) => {
  console.log(clc.black.bgGreen(" Done "), msg);
};

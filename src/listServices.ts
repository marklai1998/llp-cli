import { pluck } from "ramda";
import { listServices as getAllServices } from "./services/llp/listServices";

export const listServices = async ({ page }: { page?: number }) => {
  try {
    const { list } = await getAllServices({ page });

    list.forEach(({ service }) => {
      console.log(service);
    });
  } catch (e) {
    console.error("Failed to list services:", e);
  }
};

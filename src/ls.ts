import { listServices as getAllServices } from "./services/llp/listServices";

export const ls = async ({ page }: { page?: number; options: {} }) => {
  try {
    const { list } = await getAllServices({ page });

    list.forEach(({ service }) => {
      console.log(service);
    });
  } catch (e) {
    console.error("Failed to list services:", e);
  }
};

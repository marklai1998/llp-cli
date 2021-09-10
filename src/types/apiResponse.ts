export type APIResponse<T> = {
  ret: number;
  msg: string;
  data: T;
};

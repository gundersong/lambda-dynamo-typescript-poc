declare type Modify<T, R> = Pick<T, Exclude<keyof T, keyof R>> & R;

declare module "*.json" {
  const value: any;
  export default value;
}

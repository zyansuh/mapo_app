declare module "react-native-phone-call" {
  interface CallOptions {
    number: string;
    prompt?: boolean;
  }

  function call(options: CallOptions): Promise<void>;
  export default call;
}

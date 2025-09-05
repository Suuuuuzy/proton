export {};

declare global {
  var __HOOKS__: WeakMap<object, any>;

  interface HookOptions {
    before?: (this: any, args: any[]) => void;
    after?: (this: any, result: any, args: any[]) => any;
    replace?: (this: any, args: any[], original: Function) => any;
    name?: string;
  }

  interface ConstructorHookOptions {
    before?: (args: any[]) => void;
    after?: (instance: any, args: any[]) => void;
    replace?: (args: any[], OriginalCtor: any) => any;
    name?: string;
  }

  interface AccessorHookOptions {
    get?: (this: any, args: any[], original: Function) => any;
    set?: (this: any, args: any[], original: Function) => any;
  }
}

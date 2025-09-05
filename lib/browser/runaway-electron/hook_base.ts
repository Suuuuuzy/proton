/// <reference path="./hook_base.d.ts" />

(function initHooks (): void {
  if (!globalThis.__HOOKS__) {
    globalThis.__HOOKS__ = new WeakMap();
  }
})();

function spoofNativeToString (fn: Function, asName?: string): void {
  // Make fn.toString() look native (minimal, avoids global overrides).
  const src = `function ${asName || fn.name || ''}() { [native code] }`.trim();
  Object.defineProperty(fn, 'toString', { value () { return src; }, configurable: true });
}

function defineSameDescriptor (target: any, key: string | symbol, value: any, base: any = target): any {
  const d = Object.getOwnPropertyDescriptor(base, key) || { configurable: true, writable: true };
  const desc = { ...d, value };
  // Ensure non-enumerable method like the original.
  if ('enumerable' in d) desc.enumerable = d.enumerable;
  return Object.defineProperty(target, key, desc);
}

export function hookFunction (original: Function, { before, after, replace, name }: HookOptions): Function {
  if (__HOOKS__.has(original)) return __HOOKS__.get(original)!.wrapper;

  const wrapper = function (this: any, ...args: any[]): any {
    try { if (before) before.call(this, args); } catch {}
    if (replace) {
      // Replace can call original via provided handle.
      const res = replace.call(this, args, original);
      try { if (after) return after.call(this, res, args); } catch {}
      return res;
    }
    const res = Reflect.apply(original, this, args);
    try { if (after) return after.call(this, res, args); } catch {}
    return res;
  };

  try {
    Object.defineProperty(wrapper, 'name', { value: name || original.name, configurable: true });
  } catch {}
  try {
    Object.defineProperty(wrapper, 'length', { value: original.length, configurable: true });
  } catch {}
  spoofNativeToString(wrapper, name || original.name);
  __HOOKS__.set(original, { wrapper, original });
  return wrapper;
}

export function hookMethod (proto: any, key: string | symbol, opts: HookOptions): () => void {
  const original = proto[key];
  const wrapped = hookFunction(original, { ...opts, name: key.toString() });
  defineSameDescriptor(proto, key, wrapped);
  return () => defineSameDescriptor(proto, key, original);
}

export function hookConstructor (OriginalCtor: any, { before, after, replace, name }: ConstructorHookOptions): any {
  if (__HOOKS__.has(OriginalCtor)) return __HOOKS__.get(OriginalCtor)!.wrapper;

  const Wrapped = function (...args: any[]): any {
    try { if (before) before(args); } catch {}
    let instance;
    if (replace) {
      instance = replace(args, OriginalCtor);
    } else {
      instance = Reflect.construct(OriginalCtor, args, new.target || Wrapped);
    }
    try { if (after) after(instance, args); } catch {}
    return instance;
  };

  // Preserve prototype chain & static props (shallow)
  Wrapped.prototype = OriginalCtor.prototype;
  Object.setPrototypeOf(Wrapped, Object.getPrototypeOf(OriginalCtor));
  for (const k of Reflect.ownKeys(OriginalCtor)) {
    if (k === 'prototype') continue;
    const d = Object.getOwnPropertyDescriptor(OriginalCtor, k);
    if (d) {
      Object.defineProperty(Wrapped, k, d);
    }
  }
  try { Object.defineProperty(Wrapped, 'name', { value: name || OriginalCtor.name, configurable: true }); } catch {}
  spoofNativeToString(Wrapped, name || OriginalCtor.name);

  __HOOKS__.set(OriginalCtor, { wrapper: Wrapped, original: OriginalCtor });
  return Wrapped;
}

export function hookAccessor (obj: any, key: string | symbol, { get: gwrap, set: swrap }: AccessorHookOptions): () => void {
  const d = Object.getOwnPropertyDescriptor(obj, key);
  if (!d) return () => {};
  const get = d.get ? hookFunction(d.get, { replace: gwrap, name: `get ${key.toString()}` }) as (() => any) : undefined;
  const set = d.set ? hookFunction(d.set, { replace: swrap, name: `set ${key.toString()}` }) as ((v: any) => void) : undefined;
  Object.defineProperty(obj, key, { ...d, get, set });
  return () => Object.defineProperty(obj, key, d);
}

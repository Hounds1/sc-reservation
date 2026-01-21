import { AsyncLocalStorage } from 'async_hooks';

const storage = new AsyncLocalStorage<Map<string, any>>();

export const ExtensionContext = {
  run<T>(fn: () => T): T {
    return storage.run(new Map(), fn);
  },

  add(key: string, value: any): void {
    storage.getStore()?.set(key, value);
  },

  getAll(): Record<string, any> {
    const store = storage.getStore();
    return store ? Object.fromEntries(store) : {};
  },
};
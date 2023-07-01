/* eslint-disable no-unused-vars */

export type AdapterConfig = object;

export type CreateAdapter<T extends AdapterConfig> = (config: T) => {
   get: (identifier: string, filename: string) => void;
}

export type ProxyistAdapter<T extends AdapterConfig> = {
   createAdapter: CreateAdapter<T>;
};

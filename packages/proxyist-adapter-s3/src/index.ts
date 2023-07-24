import {
  S3Client,
  HeadObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

import type { ProxyistCreateAdapter, AdapterConfig } from '@paradisec/proxyist-adapter-common';
import stream from 'stream';

interface S3AdapterConfig extends AdapterConfig {
  bucket: string,
  prefix?: string,
  s3?: S3Client,
  transform: (identifier: string) => string,
}

export const createAdapter: ProxyistCreateAdapter<S3AdapterConfig> = async (config) => {
  console.debug('configS3', config);
  const s3 = config.s3 || new S3Client({});
  const bucketName = config.bucket;
  const prefix = config.prefix || '';

  const getPath = (identifier: string, filename: string) => {
    const path = config.transform(identifier);

    return `${prefix ? `${prefix}/` : ''}${path}/${filename}`;
  };

  const exists = async (identifier: string, filename: string) => {
    const path = getPath(identifier, filename);

    const command = new HeadObjectCommand({
      Bucket: bucketName,
      Key: path,
    });

    try {
      await s3.send(command);

      return true;
    } catch (error) {
      if (error instanceof Error && error.name === 'NotFound') {
        return false;
      }

      throw error;
    }
  };

  const read = async (identifier: string, filename: string) => {
    const path = getPath(identifier, filename);

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: path,
    });

    const object = await s3.send(command);

    // TODO deal with errors
    return object.Body as stream.Readable;
  };

  const write = async (identifier: string, filename: string) => {
    const path = getPath(identifier, filename);

    const ws = new stream.PassThrough();

    const command = {
      client: s3,
      params: {
        Bucket: bucketName,
        Key: path,
        Body: ws,
      },
    };

    const upload = new Upload(command);

    const promise = upload.done();

    return { ws, promise };
  };

  const rm = async (identifier: string, filename: string) => {
    const path = getPath(identifier, filename);

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: path,
    });

    await s3.send(command);
  };

  return {
    exists,
    read,
    write,
    rm,
  };
};

export default createAdapter;

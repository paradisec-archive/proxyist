import stream from 'node:stream';

import {
  S3Client,
  HeadObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Upload } from '@aws-sdk/lib-storage';

import type { ProxyistCreateAdapter, AdapterConfig } from '@paradisec/proxyist-adapter-common';

interface S3AdapterConfig extends AdapterConfig {
  bucket: string,
  prefix?: string,
  s3?: S3Client,
  returnRedirects?: boolean,
  redirectExpirySeconds?: number,
  transform: (identifier: string) => string,
}

export const createAdapter: ProxyistCreateAdapter<S3AdapterConfig> = async (config) => {
  const s3 = config.s3 || new S3Client({});
  const bucketName = config.bucket;
  const prefix = config.prefix || '';
  const returnRedirects = config.returnRedirects || false;
  const { redirectExpirySeconds } = config;

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

  const readBody = async (identifier: string, filename: string) => {
    const path = getPath(identifier, filename);

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: path,
    });

    const object = await s3.send(command);

    // TODO deal with errors
    return object.Body as stream.Readable;
  };

  const readRedirect = async (identifier: string, filename: string) => {
    const path = getPath(identifier, filename);

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: path,
    });

    const options = redirectExpirySeconds ? { expiresIn: redirectExpirySeconds } : undefined;

    const signedUrl = await getSignedUrl(s3, command, options);

    return signedUrl;
  };

  const read = returnRedirects ? readRedirect : readBody;

  const write = async (identifier: string, filename: string) => {
    const path = getPath(identifier, filename);

    const result = new stream.PassThrough();

    const command = {
      client: s3,
      params: {
        Bucket: bucketName,
        Key: path,
        Body: result,
      },
    };

    const upload = new Upload(command);

    const promise = upload.done();

    return { result, promise };
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

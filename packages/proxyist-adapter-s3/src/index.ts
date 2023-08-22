import stream from 'node:stream';

import {
  S3Client,
  HeadObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  GetObjectCommandInput,
  ListObjectsV2Command,
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

  const getDirectory = (identifier: string) => {
    const path = config.transform(identifier);

    return `${prefix ? `${prefix}/` : ''}${path}`;
  };

  const getPath = (identifier: string, filename: string) => {
    const directory = getDirectory(identifier);

    return `${directory}/${filename}`;
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

  const read = async (identifier: string, filename: string, download = false) => {
    const path = getPath(identifier, filename);

    const params: GetObjectCommandInput = {
      Bucket: bucketName,
      Key: path,
    };

    if (download) {
      params.ResponseContentDisposition = `attachment; filename=${filename}`;
    }
    const command = new GetObjectCommand(params);

    // TODO deal with errors

    if (returnRedirects) {
      const options = redirectExpirySeconds ? { expiresIn: redirectExpirySeconds } : undefined;

      const signedUrl = await getSignedUrl(s3, command, options);

      return signedUrl;
    }

    const object = await s3.send(command);

    return object.Body as stream.Readable;
  };

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

  const listFiles = async (identifier: string) => {
    const directory = getDirectory(identifier);

    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: directory,
    });

    const response = await s3.send(command);
    const files = response.Contents?.map((file) => file.Key).filter(Boolean) || [];

    return files.map((file) => (file as string).replace(`${directory}/`, ''));
  };

  return {
    exists,
    read,
    write,
    rm,
    listFiles,
  };
};

export default createAdapter;

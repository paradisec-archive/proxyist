import { BadIdentifierError } from '@paradisec/proxyist-adapter-common';
import { S3 } from '@aws-sdk/client-s3';

const s3Config = {
  forcePathStyle: true,
  credentials: {
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
  },
  endpoint: 'http://localhost:4568',
  region: 'ap-southeast-2',
};

const s3 = new S3(s3Config);

export default {
  directory: 'tests/data',
  bucket: 'proxyist',
  s3,
  transform: (identifier) => {
    if (identifier.includes('/')) {
      throw new BadIdentifierError('Identifer cannot contain "/"');
    }

    if (identifier.includes('-')) {
      const [, item] = identifier.split('-', 2);
      if (item === 'root') {
        throw new BadIdentifierError('Item cannot be named "root"');
      }

      return identifier.replace(/-/, '/');
    }

    return `${identifier}/root`;
  },
};

import { BadIdentifierError } from '@paradisec/proxyist-adapter-common';
import { S3 } from '@aws-sdk/client-s3'; // eslint-disable-line import/no-extraneous-dependencies

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
  type: 's3',
  ocflConfig: {
    root: 'tests/data-s3',
  },
  storageConfig: {
    bucketName: 'proxyist',
    s3,
  },
  transformIdentifier: (identifier) => {
    if (identifier.includes('/')) {
      throw new BadIdentifierError('Identifer cannot contain "/"');
    }

    if (identifier.includes('-')) {
      return identifier;
    }

    return `${identifier}-root`;
  },
  transformPath: (path) => path,
};

# OCFL backend for Proxyist

Proxyist is a web proxy which provides an object store like interface to a catalog of items which contain objects.

This adapter provides support for the [Oxford Common File Layout](https://ocfl.io/).
It can be configured to write to a local disk or S3 backend.

## Installation

See the proxyist [README.md](../proxyist/README.md) for details on how to get proxist running.
Then add this adapter.

```bash
yarn add proxyist-adapter-ocfl
```

## Configuration

Here is a sample proxyist configuration for this adapter talking to a local disk backend:
```js
import { BadIdentifier } from '@proxyist/proxyist-adapter-common';

export default {
  type: 'fs',
  ocflConfig: {
    root: 'tests/data-fs',
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
```

Here is a sample proxyist configuration for this adapter talking to an S3 backend:

```js
import { BadIdentifier } from '@proxyist/proxyist-adapter-common';

import { S3 } from '@aws-sdk/client-s3';

const s3Config = {
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
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[ISC](https://choosealicense.com/licenses/isc/)

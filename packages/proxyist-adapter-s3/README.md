# S3 end for Proxyist

Proxyist is a web proxy which provides an object store like interface to a catalog of items which contain objects.

This adapter provides support for an S3 backend.

## Installation

See the proxyist [README.md](../proxyist/README.md) for details on how to get proxist running.
Then add this adapter.

```bash
yarn add proxyist-adapter-s3
```

## Configuration

Here is a sample proxyist configuration for this adapter:
```js
import { BadIdentifierError } from '@paradisec/proxyist-adapter-common';

import { S3 } from '@aws-sdk/client-s3';

const s3Config = {
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

export default adapterConfig;
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[ISC](https://choosealicense.com/licenses/isc/)

# Proxyist

Proxyist is a web proxy which provides an object store like interface to a catalog of items which contain objects.

## Installation

```bash
yarn add proxyist
```

Follow the instructions for the adapter you want to use
- [proxyist-adapter-local](packages/proxyist-adapter-local) - Local file system backend
- [proxyist-adapter-s3](packages/proxyist-adapter-s3) - S3 Backend
- [proxyist-adapter-ocfl](packages/proxyist-adapter-ocfl) - OCFL backend which supports local file system and S3

For the rest of this example we'll use the local filesystem adapter

```bash
export PROXYIST_ADAPTER_NAME="@paradisec/proxyist-adapter-local";
export PROXYIST_ADAPTER_CONFIG="path/to/proxyist-config.js";
yarn run proxyist
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[ISC](https://choosealicense.com/licenses/isc/)

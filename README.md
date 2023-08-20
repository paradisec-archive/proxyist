# Proxyist

Proxyist is a web proxy which provides an object store like interface to a catalog of items which contain objects.
The backend object store is modular and defined through configuration. Current adapters support

* Local disk
* S3
* OCFL backed by local disk
* OCFL backed by S3

The conversion of items to the backend layout can be configured via a configuration file.

## Components

You can find more details on usage, configuration and installation in the [proxyist](packages/proxyist) package.

Specific configuration for each adapter can be found with their packages.
- [proxyist-adapter-local](packages/proxyist-adapter-local) - Local file system backend
- [proxyist-adapter-s3](packages/proxyist-adapter-s3) - S3 Backend
- [proxyist-adapter-ocfl](packages/proxyist-adapter-ocfl) - OCFL backend which supports local file system and S3

Other Supporting packages
- [proxyist-adapter-common](packages/proxyist-adapter-common)
- [proxyist-adapter-tests](packages/proxyist-adapter-tests)

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[ISC](https://choosealicense.com/licenses/ISC/)

## Dev Notes

* lerna version - Update the version on all packages including deps, git commit, tag and push
* lerna publish - Publish to npm

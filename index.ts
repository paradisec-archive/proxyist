import ocfl from '@ocfl/ocfl-s3';

const config = {
  root: 'data/myocfl',
  digestAlgorithm: 'sha256',
  layout: {
    extensionName: '000N-path-direct-storage-layout',
    replace: [
      ['https://catalog.paradisec.org.au', 'catalog_paradisec_org_au'],
      ['http://catalog.paradisec.org.au', 'catalog_paradisec_org_au'],
    ],
  },
};

const storageConfig = {
  bucketName: 's3ocflgw-test',
};

const run = async () => {
  let storage = ocfl.storage(config, storageConfig);
  console.debug(storage);

  try {
    console.log('Trying to load storage');
    storage = await ocfl.loadStorage(config, storageConfig);
  } catch (error) {
    console.log('Creating storage');
    storage = await ocfl.createStorage(config, storageConfig);
  }

  const object = storage.object('https://catalog.paradisec.org.au/NT1/001');

  await object.import('oldcatalog/NT1/001');
};

run();

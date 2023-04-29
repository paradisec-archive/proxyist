import ocfl from '@ocfl/ocfl-fs';

const storageConfig = {
  root: 'data/myocfl',
  layout: {
    extensionName: '000N-path-direct-storage-layout',
    replace: [
      ['https://catalog.paradisec.org.au', 'catalog_paradisec_org_au'],
      ['http://catalog.paradisec.org.au', 'catalog_paradisec_org_au'],
    ],
  },
};

const run = async () => {
  let storage = ocfl.storage(storageConfig);
  console.debug(storage);

  try {
    storage = await ocfl.loadStorage(storageConfig);
  } catch (error) {
    storage = await ocfl.createStorage(storageConfig);
  }

  const object = storage.object('https://catalog.paradisec.org.au/NT1/001');

  await object.import('oldcatalog/NT1/001');
};

run();

import ocfl from '@ocfl/ocfl-fs';

const run = async () => {
  const storageConfig = { root: 'data/myocfl' };
  let storage = ocfl.storage(storageConfig);
  console.debug(storage);

  try {
    storage = await ocfl.loadStorage(storageConfig);
  } catch (error) {
    storage = await ocfl.createStorage(storageConfig);
  }
  console.debug(storage);
};

run();

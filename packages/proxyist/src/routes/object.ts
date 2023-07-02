import express from 'express';
import type { ProxyistAdapter, AdapterConfig } from 'proxyist-adapter-common';

const router = express.Router();

class BadIdentifierError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BadIdentifierError';
  }
}

// FIXME put these in config later
const adapterName = 'proxyist-adapter-local';
const adapterConfig: AdapterConfig = {
  directory: 'tests/data',
  transform: (identifier: string) => {
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

const { createAdapter } = await import(adapterName) as ProxyistAdapter<AdapterConfig>;

const adapter = createAdapter(adapterConfig);

router.head('/:identifier/:filename', async (req, res) => {
  const { identifier, filename } = req.params;

  const result = await adapter.exists(identifier, filename);

  if (result) {
    return res.sendStatus(200);
  }

  return res.sendStatus(404);
});

router.get('/:identifier/:filename', async (req, res) => {
  const { identifier, filename } = req.params;

  if (!await adapter.exists(identifier, filename)) {
    return res.sendStatus(404);
  }

  const result = await adapter.read(identifier, filename);

  if (typeof result === 'string') {
    return res.redirect(result);
  }

  res.contentType(filename);

  return result.pipe(res);
});

router.post('/:identifier/:filename', async (req, res) => {
  const { identifier, filename } = req.params;

  if (await adapter.exists(identifier, filename)) {
    return res.status(409).send('File already exists');
  }

  const result = await adapter.write(identifier, filename);

  if (typeof result === 'string') {
    return res.redirect(307, result);
  }

  return req.pipe(result)
    .on('error', (err) => {
      console.error(err);
      res.status(500).send('Error writing to file');
    })
    .on('finish', () => res.sendStatus(201));
});

router.put('/:identifier/:filename', async (req, res) => {
  const { identifier, filename } = req.params;

  const result = await adapter.write(identifier, filename);

  if (typeof result === 'string') {
    return res.redirect(307, result);
  }

  return req.pipe(result)
    .on('error', (err) => {
      console.error(err);
      res.status(500).send('Error writing to file');
    })
    .on('finish', () => res.sendStatus(201));
});

router.delete('/:identifier/:filename', async (req, res) => {
  const { identifier, filename } = req.params;

  if (!await adapter.exists(identifier, filename)) {
    return res.sendStatus(404);
  }

  const result = await adapter.rm(identifier, filename);

  if (typeof result === 'string') {
    return res.redirect(result);
  }

  return res.sendStatus(204);
});

export default router;

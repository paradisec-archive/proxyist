import fs from 'node:fs';
import express from 'express';
import type { ProxyistAdapter, AdapterConfig } from 'proxyist-adapter-common';

const router = express.Router();

const adapterName = process.env.PROXYIST_ADAPTER_NAME;
if (!adapterName) {
  throw new Error('PROXYIST_ADAPTER_NAME is not set');
}

const adapterConfigPath = process.env.PROXYIST_ADAPTER_CONFIG;
if (!adapterConfigPath) {
  throw new Error('PROXYIST_ADAPTER_CONFIG is not set');
}

const { createAdapter } = await import(adapterName) as ProxyistAdapter<AdapterConfig>;

if (!fs.existsSync(adapterConfigPath)) {
  throw new Error(`Adapter config file does not exist: ${adapterConfigPath}`);
}
const adapterConfig = await import(adapterConfigPath) as { default: AdapterConfig };

const adapter = createAdapter(adapterConfig.default);

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

  const { ws, promise } = await adapter.write(identifier, filename);

  // if (typeof result === 'string') {
  //   return res.redirect(307, result);
  // }

  return req.pipe(ws)
    .on('error', (err) => {
      console.error(err);
      res.status(500).send('Error writing to file');
    })
    .on('finish', async () => { await promise; res.sendStatus(201); });
});

router.put('/:identifier/:filename', async (req, res) => {
  const { identifier, filename } = req.params;

  const { ws, promise } = await adapter.write(identifier, filename);

  // if (typeof result === 'string') {
  //   return res.redirect(307, result);
  // }
  //
  return req.pipe(ws)
    .on('error', (err) => {
      console.error(err);
      res.status(500).send('Error writing to file');
    })
    .on('finish', async () => { await promise; res.sendStatus(201); });
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

import express from 'express';
import type { ProxyistAdapter, AdapterConfig } from 'proxyist-adapter-common';

const router = express.Router();

// FIXME put these in config later
const adapterName = 'proxyist-adapter-local';
const adapterConfig: AdapterConfig = {
  path: 'data',
};
const { createAdapter } = await import(adapterName) as ProxyistAdapter<AdapterConfig>;

const adapter = createAdapter(adapterConfig);

router.get('/:identifier/:filename', (req, res) => {
  const { identifier, filename } = req.params;

  adapter.get(identifier, filename);

  res.json({ me: filename });
});

router.post('/:identifier/:filename', (req, res) => {
  const { identifier, filename } = req.params;

  adapter.get(identifier, filename);

  res.sendStatus(201);
});


export default router;

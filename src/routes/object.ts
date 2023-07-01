import express from 'express';

const router = express.Router();

// FIXME put these in config later
const adapterName = 'proxyist-local';
const Adapter = import(adapterName);

const adapterConfig = {
  path: 'data',
};

const adapter = new Adapter(adapterConfig);

router.get('/:identifier/:filename', (req, res) => {
  const identifier = req.params.identifier;
  const filename = req.params.filename;

  res.send('respond with a resource');
});

export default router;

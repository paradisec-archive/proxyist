import express from 'express';

const router = express.Router();

router.get('/:identifier', async (req, res) => {
  const { identifier } = req.params;

  const files = await req.locals.adapter.listFiles(identifier);

  res.json(files);
});

router.head('/:identifier/:filename', async (req, res) => {
  const { identifier, filename } = req.params;

  const result = await req.locals.adapter.exists(identifier, filename);

  if (result) {
    return res.sendStatus(200);
  }

  return res.sendStatus(404);
});

router.get('/:identifier/:filename', async (req, res) => {
  const { identifier, filename } = req.params;

  if (!await req.locals.adapter.exists(identifier, filename)) {
    return res.sendStatus(404);
  }

  let download = false;
  if (req.query.disposition === 'attachment') {
    download = true;
  }

  const result = await req.locals.adapter.read(identifier, filename, download);

  if (typeof result === 'string') {
    return res.redirect(result);
  }

  res.contentType(filename);

  return result.pipe(res);
});

router.post('/:identifier/:filename', async (req, res) => {
  const { identifier, filename } = req.params;

  if (await req.locals.adapter.exists(identifier, filename)) {
    return res.status(409).send('File already exists');
  }

  const { result, promise } = await req.locals.adapter.write(identifier, filename);

  if (typeof result === 'string') {
    return res.redirect(307, result);
  }

  return req.pipe(result)
    .on('error', (err: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.error(err);
      res.status(500).send('Error writing to file');
    })
    .on('finish', async () => { await promise; res.sendStatus(201); });
});

router.put('/:identifier/:filename', async (req, res) => {
  const { identifier, filename } = req.params;

  const { result, promise } = await req.locals.adapter.write(identifier, filename);

  if (typeof result === 'string') {
    return res.redirect(307, result);
  }

  return req.pipe(result)
    .on('error', (err: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.error(err);
      res.status(500).send('Error writing to file');
    })
    .on('finish', async () => { await promise; res.sendStatus(201); });
});

router.delete('/:identifier/:filename', async (req, res) => {
  const { identifier, filename } = req.params;

  if (!await req.locals.adapter.exists(identifier, filename)) {
    return res.sendStatus(404);
  }

  const result = await req.locals.adapter.rm(identifier, filename);

  if (typeof result === 'string') {
    return res.redirect(result);
  }

  return res.sendStatus(204);
});

export default router;

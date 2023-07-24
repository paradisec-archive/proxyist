import createError from 'http-errors';
import express from 'express';
import type { ErrorRequestHandler } from 'express';
// import cookieParser from 'cookie-parser';
import logger from 'morgan';
import type { ProxyistAdapter } from '@paradisec/proxyist-adapter-common';

import indexRouter from './routes/index.js';
import objectRouter from './routes/object.js';

const App = (adapter: ProxyistAdapter) => {
  const app = express();

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  // app.use(cookieParser());

  app.use((req, _res, next) => {
    req.locals = { adapter };
    next();
  });

  app.use('/', indexRouter);
  app.use('/object', objectRouter);

  // catch 404 and forward to error handler
  app.use((_req, _res, next) => {
    next(createError(404));
  });

  // error handler
  app.use(((err, req, res, _next) => { // eslint-disable-line @typescript-eslint/no-unused-vars, no-unused-vars
    // set locals, only providing error in development
    res.locals['message'] = err.message; // eslint-disable-line dot-notation
    res.locals['error'] = req.app.get('env') === 'development' ? err : {}; // eslint-disable-line dot-notation

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  }) as ErrorRequestHandler);

  return app;
};

export default App;

import container from '../common/config/ioc';
import { InversifyExpressServer } from 'inversify-express-utils';
import express from 'express';

import mongoose from 'mongoose';

import jSend from './middlewares/jSend';
import { LowercaseQueryStrings } from './middlewares/lowercaseQuery';
import { AuthMiddleware } from './middlewares/auth';

import ENV from '../common/config/env';

export default class Server {
  private server: InversifyExpressServer;
  public mongoose;
  public dbConnection: mongoose.Connection;

  constructor() {
    this.mongoose = mongoose;
    this.dbConnection = this.connectDB();
    this.server = new InversifyExpressServer(container, null, {
      rootPath: '/api',
    });

    //Define app level middleware
    this.server.setConfig(app => {
      app.disable('x-powered-by');

      app.use(express.json());
      app.use(express.urlencoded({ extended: false }));

      //Use jSend middleware
      app.use(jSend);

      //use lowercase query middleware
      app.use(LowercaseQueryStrings);

      //Add auth middleware to relevant endpoints
      app.use('/api/team', AuthMiddleware);
      app.use('/api/fixture', AuthMiddleware);
    });

    //Server level midddleware for catching inexistent routes
    this.server.setErrorConfig(app => {
      app.use((req, res, next) => {
        res.status(400).json({ message: 'API Endpoint does not exist' });
      });
    });
  }

  connectDB() {
    mongoose.set('useCreateIndex', true);
    mongoose.connect(
      ENV.MONGODB_URL,
      { useNewUrlParser: true }
    );
    return mongoose.connection;
  }

  getServer() {
    return this.server;
  }
}

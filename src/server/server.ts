import container from '../common/config/ioc';
import { InversifyExpressServer } from 'inversify-express-utils';
import express from 'express';

import mongoose from 'mongoose';

import jSend from './middlewares/jSend';

import ENV from '../common/config/env';

export default class Server {
  private server: InversifyExpressServer;
  public dbConnection: mongoose.Connection;

  constructor() {
    this.dbConnection = this.connectDB();
    this.server = new InversifyExpressServer(container, null, {
      rootPath: '/api',
    });
    this.server.setConfig(app => {
      app.use(express.json());
      app.use(express.urlencoded({ extended: false }));

      //Use jSend middleware
      app.use(jSend);
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

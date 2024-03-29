import http, { Server as HttpServer } from 'http';

import express, { Express } from 'express';

import { logger, loggerInstance } from '../logger';
import { Broker } from '../broker';
import { publishTestEvent } from '../broker/publishers';
import { appConfig } from '../config/Config';

const brokerConnection = appConfig.get('connections.broker');

export class Server {
  app: Express;
  server: HttpServer;

  constructor() {
    const app = express();

    app.use(loggerInstance);

    this.catchUncaughtException();

    this.app = app;
    this.server = http.createServer(app);
  }

  async start(port: number) {
    if (brokerConnection) {
      await Broker.init(brokerConnection);
    }

    const data = await publishTestEvent({
      hello: 'hello',
    });

    console.log(data);

    this.server.listen(port);
  }

  catchUncaughtException() {
    process.on('uncaughtException', err => {
      // log the exception
      logger.fatal(err, 'uncaught exception detected');

      this.server.close();
      // shutdown the server gracefully
      process.exit(1); // then exit
    });
  }
}

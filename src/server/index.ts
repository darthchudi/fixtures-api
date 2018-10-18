import http from 'http';
import Server from './server';

import ENV from '../common/config/env';

const server = new Server();
const app = server.getServer().build();

const httpServer = http.createServer(app);
httpServer.listen(ENV.PORT);

httpServer.on('listening', () => console.log('Listening on ' + ENV.PORT));

server.dbConnection.once('open', () => console.log('MongoDB connected!'));

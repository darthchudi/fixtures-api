import Server from './server';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import 'jest';

import HTTPStatus from '../common/constants/http-status';

const server = new Server();
const app = server.getServer().build();

afterAll(async () => {
  //Close Database
  await server.dbConnection.close();

  //Close MongoDB connection
  await server.mongoose.disconnect();
});

describe('Endpoints require tokens', () => {
  it('requires auth token for team routes', async () => {
    expect.assertions(1);
    const res = await request(app)
      .get('/api/team')
      .expect(HTTPStatus.UNAUTHORIZED_ERROR);
    expect(res.body.message).toBe('Missing authorization token in header');
  });

  it('requires auth token for fixture routes', async () => {
    expect.assertions(1);
    const res = await request(app)
      .get('/api/fixture')
      .expect(HTTPStatus.UNAUTHORIZED_ERROR);
    expect(res.body.message).toBe('Missing authorization token in header');
  });

  it('detects wrong tokens', async () => {
    expect.assertions(1);
    const fakeToken = jwt.sign({ data: 'false' }, 'fake-key', {
      expiresIn: '1h',
    });
    const res = await request(app)
      .get('/api/fixture')
      .set('Authorization', `Bearer ${fakeToken}`)
      .expect(HTTPStatus.UNAUTHORIZED_ERROR);
    expect(res.body.status).toBe('error');
  });
});

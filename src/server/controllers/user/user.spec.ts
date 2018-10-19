import Server from '../../server';
import request from 'supertest';
import 'jest';

import HTTPStatus from '../../../common/constants/http-status';
import { UserRequest } from '../../mocks';

const server = new Server();
const app = server.getServer().build();

afterAll(() => {
  return server.dbConnection.close();
});

describe('User Endpoints', () => {
  const baseUrl = '/api/user';

  let userToken: string;
  let adminToken: string;

  const createUserPayload = UserRequest();
  const createAdminPayload = {
    ...UserRequest(),
    role: 'admin',
  };

  it('Creates a user account', async () => {
    expect.assertions(1);
    const res = await request(app)
      .post(`${baseUrl}/signup`)
      .send(createUserPayload)
      .expect(HTTPStatus.OK);
    userToken = res.body.data.token;
    expect(userToken).toBeDefined();
  });

  it('prevents duplicate accounts from being created', async () => {
    expect.assertions(1);
    const res = await request(app)
      .post(`${baseUrl}/signup`)
      .send(createUserPayload)
      .expect(HTTPStatus.BAD_REQUEST);
    expect(res.body.status).toBe('error');
  });

  it('logs in a created user', async () => {
    expect.assertions(1);
    const { username, password } = createUserPayload;
    const payload = { username, password };
    const res = await request(app)
      .post(`${baseUrl}/login`)
      .send(payload)
      .expect(HTTPStatus.OK);
    expect(res.body.data.token).toBeDefined();
  });

  it('creates an admin account', async () => {
    expect.assertions(1);
    const res = await request(app)
      .post(`${baseUrl}/signup`)
      .send(createAdminPayload)
      .expect(HTTPStatus.OK);
    adminToken = res.body.data.token;
    expect(adminToken).toBeDefined();
  });

  it('logs in a created admin', async () => {
    expect.assertions(1);
    const { username, password } = createAdminPayload;
    const payload = { username, password };
    const res = await request(app)
      .post(`${baseUrl}/login`)
      .send(payload)
      .expect(HTTPStatus.OK);
    expect(res.body.data.token).toBeDefined();
  });

  it('prevents an invalid account from logging in', async () => {
    expect.assertions(1);
    const payload = { username: 'fake-username', password: 'fake-password' };
    const res = await request(app)
      .post(`${baseUrl}/login`)
      .send(payload)
      .expect(HTTPStatus.NOT_FOUND);
    expect(res.body.status).toBe('error');
  });

  it('decodes a user token', async () => {
    expect.assertions(3);
    const res = await request(app)
      .get(baseUrl)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(HTTPStatus.OK);
    expect(res.body.data.username).toBe(
      createUserPayload.username.toLowerCase()
    );
    expect(res.body.data.email).toBe(createUserPayload.email.toLowerCase());
    expect(res.body.data.role).toBe('user');
  });

  it('decodes an admin token', async () => {
    expect.assertions(3);
    const res = await request(app)
      .get(baseUrl)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(HTTPStatus.OK);
    expect(res.body.data.username).toBe(
      createAdminPayload.username.toLowerCase()
    );
    expect(res.body.data.email).toBe(createAdminPayload.email.toLowerCase());
    expect(res.body.data.role).toBe('admin');
  });
});

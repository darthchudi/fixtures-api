import Server from '../../server';
import { cleanUpMetadata } from 'inversify-express-utils';
import request from 'supertest';
import 'jest';

import HTTPStatus from '../../../common/constants/http-status';
import { UserRequest, TeamRequest, FixtureRequest } from '../../mocks';

const server = new Server();
const app = server.getServer().build();

beforeEach(() => {
  cleanUpMetadata();
});

afterAll(() => {
  return server.dbConnection.close();
});

describe('Fixture Endpoints', () => {
  const baseUrl = '/api/fixture';
  let fixture: any;

  let userToken: string, adminToken: string;
  let homeTeam: any, awayTeam: any;

  const createUserPayload = UserRequest(),
    createAdminPayload = {
      ...UserRequest(),
      role: 'admin',
    };

  let createFixtureRequest: any;

  it('creates a fixture', async () => {
    expect.assertions(2);

    //create user, admin accounts
    const userResponse = await request(app)
      .post('/api/user/signup')
      .send(createUserPayload);
    const adminResponse = await request(app)
      .post('/api/user/signup')
      .send(createAdminPayload);
    userToken = userResponse.body.data.token;
    adminToken = adminResponse.body.data.token;

    //create teams
    const teamRequests = Array.from({ length: 10 }, () => {
      return request(app)
        .post('/api/team')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(TeamRequest());
    });
    [homeTeam, awayTeam] = await Promise.all(teamRequests);

    createFixtureRequest = {
      ...FixtureRequest(),
      home_team: homeTeam.body.data.id,
      away_team: awayTeam.body.data.id,
    };

    //create fixture
    const res = await request(app)
      .post(baseUrl)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(createFixtureRequest)
      .expect(HTTPStatus.OK);
    fixture = res.body.data;
    expect(fixture.home_team.id).toBe(createFixtureRequest.home_team);
    expect(fixture.away_team.id).toBe(createFixtureRequest.away_team);
  });

  it('finds a fixture by ID', async () => {
    expect.assertions(2);
    const res = await request(app)
      .get(`${baseUrl}/${fixture.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(HTTPStatus.OK);
    expect(res.body.data.home_team.id).toBe(fixture.home_team.id);
    expect(res.body.data.away_team.id).toBe(fixture.away_team.id);
  });

  it('finds all fixtures', async () => {
    expect.assertions(2);
    const res = await request(app)
      .get(baseUrl)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(HTTPStatus.OK);
    expect(Array.isArray(res.body.data)).toBeTruthy();
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('finds fixtures by queries', async () => {
    expect.assertions(2);
    const res = await request(app)
      .get(`${baseUrl}?stadium=${createFixtureRequest.stadium}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(HTTPStatus.OK);
    expect(Array.isArray(res.body.data)).toBeTruthy();
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('finds pending fixtures', async () => {
    expect.assertions(2);
    const res = await request(app)
      .get(`${baseUrl}?status=pending`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(HTTPStatus.OK);
    expect(Array.isArray(res.body.data)).toBeTruthy();
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('finds completed fixtures', async () => {
    expect.assertions(1);
    const res = await request(app)
      .get(`${baseUrl}?status=completed`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(HTTPStatus.OK);
    expect(Array.isArray(res.body.data)).toBeTruthy();
  });

  it('prevents regular users from creating fixtures', async () => {
    expect.assertions(2);
    const res = await request(app)
      .post(baseUrl)
      .set('Authorization', `Bearer ${userToken}`)
      .send(createFixtureRequest)
      .expect(HTTPStatus.UNAUTHORIZED_ERROR);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toBe('Unauthorized user');
  });

  it('returns an error when a HTTP mutation request is missing an Auth Header', async () => {
    expect.assertions(1);
    const res = await request(app)
      .post(baseUrl)
      .send(createFixtureRequest)
      .expect(HTTPStatus.UNAUTHORIZED_ERROR);
    expect(res.body.status).toBe('error');
  });

  it('updates a fixture', async () => {
    expect.assertions(2);
    const update = {
      date: '2018-10-19T23:02:43.462Z',
      time: '11am',
    };
    const res = await request(app)
      .put(`${baseUrl}/${fixture.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(update)
      .expect(HTTPStatus.OK);
    fixture = res.body.data;
    expect(fixture.date).toBe(update.date);
    expect(fixture.time).toBe(update.time);
  });

  it('deletes a fixture', async () => {
    expect.assertions(1);
    const res = await request(app)
      .delete(`${baseUrl}/${fixture.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(HTTPStatus.OK);
    expect(res.body.status).toBe('success');
  });
});

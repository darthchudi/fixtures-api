import Server from '../../server';
import request from 'supertest';
import 'jest';

import HTTPStatus from '../../../common/constants/http-status';
import { UserRequest, TeamRequest } from '../../mocks';

const server = new Server();
const app = server.getServer().build();

afterAll(() => {
  return server.dbConnection.close();
});

describe('Team Endpoints', () => {
  const baseUrl = '/api/team';

  let userToken: string;
  let adminToken: string;

  const createUserPayload = UserRequest();
  const createAdminPayload = {
    ...UserRequest(),
    role: 'admin',
  };

  const createTeamPayload = TeamRequest();
  let team: any;

  it('creates a team', async () => {
    expect.assertions(2);
    //create user and admin accounts
    const userResponse = await request(app)
      .post('/api/user/signup')
      .send(createUserPayload);
    const adminResponse = await request(app)
      .post('/api/user/signup')
      .send(createAdminPayload);

    userToken = userResponse.body.data.token;
    adminToken = adminResponse.body.data.token;

    //create team
    const res = await request(app)
      .post(baseUrl)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(createTeamPayload);
    team = res.body.data;
    expect(team.name).toBe(createTeamPayload.name.toLowerCase());
    expect(team.stadium).toBe(createTeamPayload.stadium.toLowerCase());
  });

  it('prevents duplicate teams from being created', async () => {
    expect.assertions(1);
    const res = await request(app)
      .post(baseUrl)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(createTeamPayload)
      .expect(HTTPStatus.BAD_REQUEST);
    expect(res.body.status).toBe('error');
  });

  it('prevents regular users from creating teams', async () => {
    expect.assertions(2);
    const res = await request(app)
      .post(baseUrl)
      .set('Authorization', `Bearer ${userToken}`)
      .send(createTeamPayload)
      .expect(HTTPStatus.UNAUTHORIZED_ERROR);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toBe('Unauthorized user');
  });

  it('returns an error when a HTTP mutation request is missing an Auth Header', async () => {
    expect.assertions(1);
    const res = await request(app)
      .post(baseUrl)
      .send(TeamRequest())
      .expect(HTTPStatus.UNAUTHORIZED_ERROR);
    expect(res.body.status).toBe('error');
  });

  it('updates a team', async () => {
    expect.assertions(2);
    const mockTeam = TeamRequest();
    const update = {
      stadium: mockTeam.stadium,
      name: mockTeam.name,
    };
    const res = await request(app)
      .put(`${baseUrl}/${team.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(update)
      .expect(HTTPStatus.OK);
    team = res.body.data;
    expect(team.name).toBe(update.name.toLowerCase());
    expect(team.stadium).toBe(update.stadium.toLowerCase());
  });

  it('finds a team by ID', async () => {
    expect.assertions(2);
    const res = await request(app)
      .get(`${baseUrl}/${team.id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(HTTPStatus.OK);
    expect(res.body.data.name).toBe(team.name);
    expect(res.body.data.stadium).toBe(team.stadium);
  });

  it('finds all teams', async () => {
    expect.assertions(2);
    const res = await request(app)
      .get(baseUrl)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(HTTPStatus.OK);
    expect(Array.isArray(res.body.data)).toBeTruthy();
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('finds teams by queries', async () => {
    expect.assertions(2);
    const res = await request(app)
      .get(`${baseUrl}?stadium=${team.stadium}&short_name=${team.short_name}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(HTTPStatus.OK);
    expect(Array.isArray(res.body.data)).toBeTruthy();
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('deletes a team', async () => {
    expect.assertions(1);
    const res = await request(app)
      .delete(`${baseUrl}/${team.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(HTTPStatus.OK);
    expect(res.body.status).toBe('success');
  });
});

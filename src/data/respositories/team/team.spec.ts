import 'reflect-metadata';

import 'jest';
import mongoose from 'mongoose';
import ENV from '../../../common/config/env';

import _ from 'lodash';

import TeamRepository from '../team/team';

import { TeamRequest } from '../../../server/mocks';

import { ITeamModel } from '../../models/team';

let request, teamRepository: TeamRepository, team: ITeamModel;

beforeAll(async () => {
  mongoose.connect(ENV.MONGODB_URL);

  teamRepository = new TeamRepository();

  request = TeamRequest();
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoose.disconnect();
});

describe('Team Operations', () => {
  it('creates a team', async () => {
    expect.assertions(2);

    team = await teamRepository.create(request);
    expect(team.name).toBe(_.toLower(request.name));
    expect(team.city).toBe(_.toLower(request.city));
  });

  it('prevents duplicate teams from being created', () => {
    expect.assertions(1);
    return teamRepository.create(request).catch(e => {
      expect(e.message).toBe('team already exists');
    });
  });

  it('finds a team by ID', async () => {
    expect.assertions(2);
    const res = await teamRepository.byID(team.id);
    expect(res.name).toBe(team.name);
    expect(res.city).toBe(team.city);
  });

  it('finds all teams', async () => {
    expect.assertions(2);
    const teams = await teamRepository.all({
      conditions: {},
    });
    expect(Array.isArray(teams)).toBeTruthy();
    expect(teams.length).toBeGreaterThan(0);
  });

  it('finds teams by queries', async () => {
    expect.assertions(2);
    const teams = await teamRepository.all({
      conditions: {
        name: team.name,
      },
    });
    expect(Array.isArray(teams)).toBeTruthy();
    expect(teams.length).toBeGreaterThan(0);
  });

  it('updates a team', async () => {
    expect.assertions(2);
    const update = {
      name: 'enyimba united',
      stadium: 'enugu',
    };
    const result = await teamRepository.update(team.id, update);
    expect(result.name).toBe(update.name);
    expect(result.stadium).toBe(update.stadium);
  });

  it('deletes a team', async () => {
    expect.assertions(1);
    const result = await teamRepository.delete(team.id);
    expect(result).toBeTruthy();
  });
});

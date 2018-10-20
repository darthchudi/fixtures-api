import 'reflect-metadata';

import 'jest';
import mongoose from 'mongoose';
import ENV from '../../../common/config/env';

import FixtureRespository from './fixture';
import TeamRepository from '../team/team';

import { FixtureRequest, TeamRequest } from '../../../server/mocks';

import { ITeamModel } from '../../models/team';
import { IFixtureModel } from '../../models/fixture';

let request,
  fixture: IFixtureModel,
  fixtureRepository: FixtureRespository,
  teamRepository: TeamRepository,
  homeTeam: ITeamModel,
  awayTeam: ITeamModel;

beforeAll(async () => {
  mongoose.connect(
    ENV.MONGODB_URL,
    { useNewUrlParser: true }
  );

  fixtureRepository = new FixtureRespository();

  //create mock teams in DB
  teamRepository = new TeamRepository();
  homeTeam = await teamRepository.create(TeamRequest());
  awayTeam = await teamRepository.create(TeamRequest());

  request = {
    ...FixtureRequest(),
    home_team: homeTeam.id,
    away_team: awayTeam.id,
  };
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoose.disconnect();
});

describe('Fixture Operations', () => {
  it('creates a fixture', async () => {
    expect.assertions(3);

    fixture = await fixtureRepository.create(request);
    expect((fixture.home_team as ITeamModel).id).toBe(request.home_team);
    expect((fixture.away_team as ITeamModel).id).toBe(request.away_team);
    expect(fixture.date).toBeDefined();
  });

  it('finds a fixture by ID', async () => {
    expect.assertions(2);
    const res = await fixtureRepository.byID(fixture.id);
    expect(res.stadium).toBe(fixture.stadium);
    expect(res.id).toBe(fixture.id);
  });

  it('finds all fixtures', async () => {
    expect.assertions(2);
    const fixtures = await fixtureRepository.all({
      conditions: {},
    });
    expect(Array.isArray(fixtures)).toBeTruthy();
    expect(fixtures.length).toBeGreaterThan(0);
  });

  it('finds fixtures by queries', async () => {
    expect.assertions(2);
    const fixtures = await fixtureRepository.all({
      conditions: {
        home_team: {
          _id: homeTeam.id,
        },
      },
    });
    expect(Array.isArray(fixtures)).toBeTruthy();
    expect(fixtures.length).toBeGreaterThan(0);
  });

  it('finds pending fixtures', async () => {
    expect.assertions(2);
    const fixtures = await fixtureRepository.all({
      conditions: {
        status: 'pending',
      },
    });
    expect(Array.isArray(fixtures)).toBeTruthy();
    expect(fixtures.length).toBeGreaterThan(0);
  });

  it('finds completed fixtures', async () => {
    expect.assertions(1);
    const fixtures = await fixtureRepository.all({
      conditions: {
        status: 'completed',
      },
    });
    expect(Array.isArray(fixtures)).toBeTruthy();
  });

  it('updates a fixture', async () => {
    expect.assertions(2);
    const update = {
      status: 'completed',
      time: '3pm',
    };
    const result = await fixtureRepository.update(fixture.id, update);
    expect(result.status).toBe(update.status);
    expect(result.time).toBe(update.time);
  });

  it('deletes a fixture', async () => {
    expect.assertions(1);
    const result = await fixtureRepository.delete(fixture.id);
    expect(result).toBeTruthy();
  });
});

import BaseRepository from './base';
import { injectable } from 'inversify';

import { IFixtureModel } from '../models/fixture';
import FixtureSchema from '../schemas/fixture';

import { QueryOptions } from '../contracts/repository';

@injectable()
export default class FixtureRepository extends BaseRepository<IFixtureModel> {
  constructor() {
    super('Fixtures', FixtureSchema, 'fixture');
  }

  create(attributes: any): Promise<IFixtureModel> {
    return new Promise<IFixtureModel>((resolve, reject) => {
      super.create(attributes).then(
        fixtureDoc => {
          fixtureDoc
            .populate('home_team')
            .populate('away_team', (err, result) => {
              if (err) return reject(err);
              resolve(result);
            });
        },
        e => {
          reject(e);
        }
      );
    });
  }

  byID(id: string, projections?: any): Promise<IFixtureModel> {
    return new Promise<IFixtureModel>((resolve, reject) => {
      super.byID(id, projections).then(
        fixtureDoc => {
          fixtureDoc
            .populate('home_team')
            .populate('away_team', (err, result) => {
              if (err) return reject(err);
              resolve(result);
            });
        },
        e => {
          reject(e);
        }
      );
    });
  }

  all(options: QueryOptions): Promise<IFixtureModel[]> {
    return new Promise<IFixtureModel[]>((resolve, reject) => {
      let homeTeamQuery = {};
      let awayTeamQuery = {};

      if (options.conditions.home_team) {
        homeTeamQuery = { ...options.conditions.home_team };
        delete options.conditions.home_team;
      }

      if (options.conditions.away_team) {
        awayTeamQuery = { ...options.conditions.away_team };
        delete options.conditions.away_team;
      }

      this.model
        .find(options.conditions, options.projections)
        .select(options.select)
        .populate({ path: 'home_team', match: homeTeamQuery })
        .populate({ path: 'away_team', match: awayTeamQuery })
        .exec((err, result) => {
          if (err) return reject(err);

          const areTeamQueriesPresent =
            Object.keys(homeTeamQuery).length > 0 ||
            Object.keys(awayTeamQuery).length > 0;

          if (!areTeamQueriesPresent) return resolve(result);

          const filteredTeams = result.filter(team => {
            return team.home_team !== null && team.away_team !== null;
          });
          return resolve(filteredTeams);
        });
    });
  }
}

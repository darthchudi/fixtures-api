import BaseRepository from './base';
import { injectable } from 'inversify';

import { IFixtureModel } from '../models/fixture';
import FixtureSchema from '../schemas/fixture';

@injectable()
export default class FixtureRepository extends BaseRepository<IFixtureModel> {
  constructor() {
    super('Fixtures', FixtureSchema, 'fixture');
  }
}

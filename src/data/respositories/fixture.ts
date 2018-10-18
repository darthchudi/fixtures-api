import BaseRepository from './base';

import { IFixtureModel } from '../models/fixture';
import FixtureSchema from '../schemas/fixture';

export default class FixtureRepository extends BaseRepository<IFixtureModel> {
  constructor() {
    super('Fixtures', FixtureSchema, 'fixture');
  }
}

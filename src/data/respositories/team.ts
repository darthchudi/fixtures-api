import BaseRepository from './base';
import { injectable } from 'inversify';

import { ITeamModel } from '../models/team';
import TeamSchema from '../schemas/team';

@injectable()
export default class TeamRepository extends BaseRepository<ITeamModel> {
  constructor() {
    super('Teams', TeamSchema, 'team');
  }
}

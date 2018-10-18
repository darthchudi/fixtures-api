import BaseRepository from './base';

import { ITeamModel } from '../models/team';
import TeamSchema from '../schemas/team';

export default class TeamRepository extends BaseRepository<ITeamModel> {
  constructor() {
    super('Teams', TeamSchema, 'team');
  }
}

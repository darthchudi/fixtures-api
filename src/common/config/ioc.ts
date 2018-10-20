import 'reflect-metadata';
import { Container } from 'inversify';

import CONSTANTS from '../constants/identifiers';

import UserRepository from '../../data/respositories/user';
import FixtureRepository from '../../data/respositories/fixture/fixture';
import TeamRepository from '../../data/respositories/team';

import '../../server/controllers';

const container = new Container();
container.bind<UserRepository>(CONSTANTS.USER_REPOSITORY).to(UserRepository);
container
  .bind<FixtureRepository>(CONSTANTS.FIXTURE_REPOSITORY)
  .to(FixtureRepository);
container.bind<TeamRepository>(CONSTANTS.TEAM_REPOSITORY).to(TeamRepository);

export default container;

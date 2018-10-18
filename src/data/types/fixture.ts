import { Timestamps } from './';
import { IScore } from './score';
import { ITeam } from './team';

export interface IFixture extends Timestamps {
  id: string;
  home_team: string | ITeam;
  away_team: string | ITeam;
  date: Date;
  time: string;
  match_day: number;
  stadium: string;
  competition: string;
  stage: string;
  group: string;
  score: IScore;
}

import { Timestamps } from './';
import { IScore } from './score';
import { ITeam } from './team';

export interface IFixture extends Timestamps {
  away_team: string | ITeam;
  competition: string;
  date: Date;
  home_team: string | ITeam;
  group: string;
  match_day: number;
  stadium: string;
  stage: string;
  score: IScore;
  time: string;
}

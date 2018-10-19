import { Timestamps } from './';
import { IScore } from './score';
import { ITeam } from './team';

enum IMatchStatus {
  pending = 'pending',
  completed = 'completed',
  ongoing = 'ongoing',
}

export interface IFixture extends Timestamps {
  away_team: string | ITeam;
  competition: string;
  date: Date;
  home_team: string | ITeam;
  group: string;
  match_day: number;
  stadium: string;
  stage: string;
  status: IMatchStatus;
  score: IScore;
  time: string;
}

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
  date: Date;
  home_team: string | ITeam;
  match_day: number;
  stadium: string;
  status: IMatchStatus;
  score: IScore;
  time: string;
}

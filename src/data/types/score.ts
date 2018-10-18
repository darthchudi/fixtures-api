import { ITeam } from './team';

export interface IScore {
  away_team: number;
  home_team: number;
  winner: string | ITeam;
}

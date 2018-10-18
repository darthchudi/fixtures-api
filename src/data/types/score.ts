import { ITeam } from './team';

export interface IScore {
  winner: string | ITeam;
  home_team: number;
  away_team: number;
}

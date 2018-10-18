import { Timestamps } from './';

export interface IArea {
  city: string;
  country: string;
}

export interface ITeam extends Timestamps {
  area: IArea;
  league: string;
  name: string;
  stadium: string;
}

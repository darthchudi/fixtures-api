import { Timestamps } from './';

export interface IArea {
  city: string;
  country: string;
}

export interface ITeam extends Timestamps {
  id: string;
  name: string;
  stadium: string;
  league: string;
  area: IArea;
}

import { Timestamps } from './';

export interface ITeam extends Timestamps {
  city: string;
  name: string;
  short_name: string;
  stadium: string;
}

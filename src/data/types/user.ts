import { Timestamps } from './';

export interface IUser extends Timestamps {
  email: string;
  first_name: string;
  role: string;
  last_name: string;
  password: string;
  username: string;
}

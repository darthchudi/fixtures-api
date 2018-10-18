import { Timestamps } from './';

export interface IUser extends Timestamps {
  email: string;
  first_name: string;
  is_admin: boolean;
  last_name: string;
  phone_number: string;
  password: string;
  username: string;
}

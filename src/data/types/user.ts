import { Timestamps } from './';

export interface IUser extends Timestamps {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone_number: string;
  password: string;
  is_admin: boolean;
}

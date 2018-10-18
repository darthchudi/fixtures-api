import { Document } from 'mongoose';
import { IUser } from '../types/user';

export interface IUserModel extends IUser, Document {}

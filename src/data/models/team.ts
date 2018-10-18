import { Document } from 'mongoose';
import { ITeam } from '../types/team';

export interface ITeamModel extends ITeam, Document {}

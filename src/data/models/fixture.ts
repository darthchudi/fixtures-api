import { Document } from 'mongoose';
import { IFixture } from '../types/fixture';

export interface IFixtureModel extends IFixture, Document {}

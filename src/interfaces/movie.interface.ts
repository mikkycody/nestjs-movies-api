import { Document, Types } from 'mongoose';
import { GenderEnum } from '../enums';

export interface Movie extends Document {
  readonly title: String;
  readonly userId: Types.ObjectId;
  readonly description: String;
  readonly releaseDate: Date;
  readonly rating: Number;
  readonly gender: GenderEnum;
  readonly actors: Array<String>;
  readonly post: String;
}

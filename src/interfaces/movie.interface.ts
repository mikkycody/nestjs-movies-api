import { Document } from 'mongoose';
import { GenderEnum } from 'src/enums';

export interface Movie extends Document {
  readonly title: String;
  readonly userId: Number;
  readonly description: String;
  readonly releaseDate: Date;
  readonly rating: Number;
  readonly gender: GenderEnum;
  readonly actors: Array<String>;
  readonly post: String;
}

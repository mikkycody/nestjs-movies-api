import * as mongoose from 'mongoose';
import { GenderEnum } from 'src/Enums';
export const MovieSchema = new mongoose.Schema({
  title: String,
  description: String,
  releaseDate: Date,
  rating: Number,
  gender: GenderEnum,
  actors: Array<String>,
  post: String,
});

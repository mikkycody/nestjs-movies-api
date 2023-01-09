import * as mongoose from 'mongoose';
import { GenderEnum } from '../../../tmp/enums';
export const MovieSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  rating: { type: Number, required: true },
  gender: { type: String, required: true, enum: GenderEnum },
  actors: { type: [String], required: true },
  imageUrl: { type: String, required: true },
});

import { ObjectId } from 'mongoose';

export type UserResourceType = {
  id: ObjectId;
  email: String;
  firstName: String;
  lastName: String;
  token: String;
};

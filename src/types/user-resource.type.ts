import { Types } from 'mongoose';

export type UserResourceType = {
  id: Types.ObjectId;
  email: String;
  firstName: String;
  lastName: String;
  token: String;
};

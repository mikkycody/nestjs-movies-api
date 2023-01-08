import { Connection } from 'mongoose';
import { UserSchema } from '../../database/schemas/User/user.schema';
import { USER_MODEL, DATABASE_CONNECTION } from '../../config/constants';
export const authProviders = [
  {
    provide: USER_MODEL,
    useFactory: (connection: Connection) => connection.model('User', UserSchema),
    inject: [DATABASE_CONNECTION],
  },
];
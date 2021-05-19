/* eslint-disable func-names */
import { Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

import { IUser } from '../../interfaces/user.interface';
import mongoose from '../../database';

const UserSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre<IUser>('save', async function (next) {
  const hash = await bcrypt.hash(this.password || '', 10);
  this.password = hash;

  next();
});

const User: Model<IUser> = mongoose.model('User', UserSchema);

export default User;

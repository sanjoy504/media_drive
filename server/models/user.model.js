import { Schema, model } from 'mongoose';

//User All Data Schema 
const userSchema = new Schema({

  name: { type: String, required: true },

  avatar: { type: String, required: true },

  email: { type: String, required: false },

  otp: { type: String, require: false },

  otpExpiration: { type: Date, required: false },

  createdAt: { type: Date, default: Date.now },

  authToken: { type: String, required: false }
});

const User = model('User', userSchema);

export default User;
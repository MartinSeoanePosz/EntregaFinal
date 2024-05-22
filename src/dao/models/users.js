import mongoose from "mongoose";

const userCollection = "users";

const UserSchema = new mongoose.Schema({
  firstName: { type: String, require: true, max: 100 },
  lastName: { type: String, require: true, max: 100 },  
  age: { type: Number, require: true, max: 100 },
  email: { type: String, require: true, max: 100, unique: true},
  password: { type: String, require: true, max: 100 },
  cart: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'carts' 
  }],
  role: { type: String, require: true, max: 100, default : "user"},
  documents: { type: [mongoose.Schema.Types.ObjectId], default: [] },
  lastConnection: { type: Date, require: false, default: Date.now },
  resetPasswordToken: { type: String, require: false },
  resetPasswordExpires: { type: Date, require: false }
});

const User = mongoose.model(userCollection, UserSchema);

export default User;
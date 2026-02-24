import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /.+\@.+\..+/,
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  try {
    this.passwordHash = await bcryptjs.hash(this.passwordHash, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// Static method: find user by email
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Instance method: compare password
userSchema.methods.comparePassword = async function (password) {
  return await bcryptjs.compare(password, this.passwordHash);
};

// Instance method: update password
userSchema.methods.updatePassword = async function (newPassword) {
  this.passwordHash = newPassword;
  await this.save();
};

export default mongoose.model('User', userSchema);

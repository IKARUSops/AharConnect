const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Restaurant', 'Foodie'],
    required: true
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  role: {
    type: String,
    enum: ['customer', 'restaurant', 'admin'],
    default: 'customer'
  },
  avatar: {
    type: String
  },
  preferences: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Model methods
userSchema.statics.findByEmail = async function(email) {
  return this.findOne({ email });
};

userSchema.statics.findByEmailAndType = async function(email, type) {
  return this.findOne({ email, type });
};

userSchema.statics.findByIdWithoutPassword = async function(id) {
  return this.findById(id).select('-password');
};

userSchema.statics.updateProfile = async function(id, profileFields) {
  return this.findByIdAndUpdate(
    id,
    { $set: profileFields },
    { new: true }
  ).select('-password');
};

userSchema.statics.createUser = async function(userData) {
  const user = new this(userData);
  return user.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;

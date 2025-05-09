const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  // Combined role and type fields
  role: {
    type: String,
    enum: ['admin', 'customer'],
    default: 'customer'
  },
  type: {
    type: String,
    enum: ['Restaurant', 'Foodie'],
    required: true, // Keeping required true as in GitHub version
    default: function() {
      // Default mapping between role and type
      // This ensures type is always set when required
      return this.role === 'admin' ? 'Restaurant' : 'Foodie';
    }
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  profilePicture: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: Date
}, {
  timestamps: true // This automatically handles createdAt and updatedAt
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    // Ensure type-role compatibility for new users or role changes
    if (this.isModified('role') && !this.isModified('type')) {
      // If role changed but type didn't, update type to match role
      this.type = this.role === 'admin' ? 'Restaurant' : 'Foodie';
    } else if (this.isModified('type') && !this.isModified('role')) {
      // If type changed but role didn't, update role to match type
      this.role = this.type === 'Restaurant' ? 'admin' : 'customer';
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT token
userSchema.methods.generateAuthToken = function() {
  // Create base payload
  const payload = { 
    userId: this._id, // Using userId for your middleware
    id: this._id,     // Using id for GitHub middleware
    email: this.email
  };
  
  // Add role and type if they exist
  if (this.role) payload.role = this.role;
  if (this.type) payload.type = this.type;
  
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Method to get public profile
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.verificationToken;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpires;
  return userObject;
};

// For GitHub version compatibility - create toJSON method
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password; // Remove password for security
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

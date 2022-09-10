const mongoose = require('mongoose');
const validator = require('validator');
const brcypt = require('bcrypt');

const Roles = require('../utils/roles');

const UserSchema = mongoose.Schema(
  {
    location: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
        required: [true, 'Please specify coordinates'],
      },
      street: {
        type: String,
        trim: true,
        required: [true, 'Please provide a valid street.'],
        minlength: [10, 'Minimum 10 characters required for street.'],
        maxlength: [150, 'Maximum 150 characters allowed for street.'],
      },
      city: {
        type: String,
        trim: true,
        required: [true, 'Please provide a valid city.'],
        minlength: [3, 'Minimum 3 characters required for city.'],
        maxlength: [30, 'Maximum 30 characters allowed for city.'],
        set: (value) => String(value).toLowerCase(),
      },
      zipcode: {
        type: Number,
        required: false,
        validate: {
          validator: (value) => !Number.isNaN(value),
          message: 'Please enter a valid zipcode',
        },
      },
      country: {
        type: String,
        required: [true, 'Please provide a valid country.'],
        trim: true,
        minlength: [5, 'Minimum 5 characters required for country.'],
        maxlength: [30, 'Maximum 30 characters allowed for country.'],
      },
    },
    name: {
      firstName: {
        type: String,
        trim: true,
        required: [true, 'Please provide a first name.'],
        maxlength: [30, 'Maximum 30 characters allowed for first name.'],
        lowercase: true,
      },
      lastName: {
        type: String,
        trim: true,
        required: [true, 'Please provide a last name.'],
        maxlength: [30, 'Maximum 30 characters allowed for last name.'],
        lowercase: true,
      },
    },
    username: {
      type: String,
      unique: true,
      trim: true,
      required: [true, 'Please provide a username.'],
      minlength: [8, 'Minimum 8 characters required for username.'],
      lowercase: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: [true, 'Please provide a email address.'],
      validate: {
        validator: (value) => validator.isEmail(value),
        message: 'Please enter a valid email address.',
      },
      lowercase: true,
    },
    role: {
      type: String,
      default: 'user',
      enum: [Roles.admin, Roles.user],
    },
    password: {
      type: String,
      trim: true,
      required: [true, 'Please provide a password.'],
      validate: {
        validator: (value) => validator.isStrongPassword(value),
        message:
          'Password must be at least 8 characters long, 1 Uppercase, 1 Lowercase and 1 special character',
      },
    },
    confirmPassword: {
      type: String,
      trim: true,
      required: [true, 'Please confirm your password.'],
      validate: {
        validator: function (value) {
          return this.password === value;
        },
        message: 'Password and confirm password are not matching.',
      },
    },
    gender: {
      type: String,
      required: [true, 'Please provide a valid gender.'],
      enum: {
        values: ['male', 'female', 'other'],
        message: 'Please provide a valid gender',
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpiresAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// PRE MIDDLEWARES

// This middleware is use to encrypt password whenever user signups
UserSchema.pre('save', async function (next) {
  // if the password is not modified, go to next middleware
  if (!this.isModified('password')) return next();

  // create a hash of password
  this.password = await brcypt.hash(this.password, 12);

  // remove confirm password
  this.confirmPassword = undefined;
  next();
});

// METHODS

UserSchema.methods.verifyPassword = async function (password, hashPassword) {
  return await brcypt.compare(password, hashPassword);
};

UserSchema.methods.changedPasswordAfterAssigningToken = function (
  JWTTimeStamp
) {
  if (this.passwordChangeAt) {
    const changedTimestamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimestamp;
  }
  return false;
};

const UserModel = mongoose.model('Users', UserSchema);

module.exports = UserModel;

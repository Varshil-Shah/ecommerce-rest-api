const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = mongoose.Schema({
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
      required: [true, 'Please provide description.'],
      minlength: [10, 'Minimum 10 characters required for street.'],
      maxlength: [50, 'Maximum 50 characters allowed for street.'],
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
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, 'Please provide a last name.'],
      maxlength: [30, 'Maximum 30 characters allowed for last name.'],
    },
  },
  username: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'Please provide a username.'],
    minlength: [8, 'Minimum 8 characters required for username.'],
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
  },
  role: {
    type: String,
    default: 'user',
    enum: ['admin', 'user'],
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
});

const UserModel = mongoose.model('Users', UserSchema);

module.exports = UserModel;

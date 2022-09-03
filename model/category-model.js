const mongoose = require('mongoose');
const validator = require('validator');

const CategorySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A category must have a name.'],
    unique: true,
    set: (value) => String(value).toLowerCase(),
    trim: true,
  },
  image: {
    type: String,
    required: [true, 'A category must have an banner image'],
    trim: true,
    validate: {
      validator: (value) => validator.isURL(value),
      message: 'Please enter a valid image URL.',
    },
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: [true, 'A category must have a creator Id.'],
  },
  accepted: {
    type: Boolean,
    default: false,
  },
});

const CategoryModel = mongoose.model('Categories', CategorySchema);

module.exports = CategoryModel;

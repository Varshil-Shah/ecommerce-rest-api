const mongoose = require('mongoose');
const validator = require('validator');

const CategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A category must have a name.'],
      trim: true,
      unique: true,
      lowercase: true,
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// QUERY MIDDLEWARE
CategorySchema.pre(/^find/, function (next) {
  this.populate({
    path: 'creator',
    select: '-location -password -gender -createdAt -updatedAt -active -__v',
  });
  next();
});

CategorySchema.pre('aggregate', function (next) {
  this.pipeline().unshift(
    {
      $lookup: {
        from: 'users',
        localField: 'creator',
        foreignField: '_id',
        as: 'creator',
      },
    },
    {
      $unwind: '$creator',
    },
    {
      $project: {
        'creator.location': 0,
        'creator.password': 0,
        'creator.gender': 0,
        'creator.createdAt': 0,
        'creator.updatedAt': 0,
        'creator.active': 0,
        'creator.__v': 0,
      },
    }
  );
  next();
});

const CategoryModel = mongoose.model('Categories', CategorySchema);

module.exports = CategoryModel;

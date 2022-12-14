const mongoose = require('mongoose');
const validator = require('validator');

const ProductSchema = mongoose.Schema(
  {
    title: {
      type: String,
      lowercase: true,
      trim: true,
      required: [true, 'A product title is required!'],
      minlength: [10, 'Minimum 10 characters required for product title.'],
      maxlength: [30, 'Maximum 30 characters allowed for product title.'],
      validate: {
        validator: function (value) {
          return /^[a-zA-Z0-9 ]*$/.test(value);
        },
        message: 'A product name should contain only alphabets or number',
      },
    },
    price: {
      type: Number,
      required: [true, 'Product price is mandatory.'],
      min: [1, 'Minimum required price is 1.'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'Product description is mandatory.'],
      minlength: [
        20,
        'Minimum 20 characters required for product description.',
      ],
      maxlength: [
        150,
        'Maximum 150 characters allowed for product description.',
      ],
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: 'Categories',
      required: [true, 'Product category are required.'],
    },
    images: {
      type: [String],
      required: [true, 'Product images are mandatory'],
      validate: {
        validator: (values) => {
          if (values.length >= 3) {
            values.forEach((value) => {
              if (!validator.isURL(value)) return false;
            });
            return true;
          }
          return false;
        },
        message: 'Please enter at least 3 images which are valid ones.',
      },
    },
    creator: {
      type: mongoose.Types.ObjectId,
      ref: 'Users',
      required: [true, 'Product creator is required.'],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (value) => Math.round(value * 10) / 10,
    },
    ratingsCount: {
      type: Number,
      default: 0,
      min: [0, 'Number of ratings must be positive number'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ProductSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'category',
    select: '-creator -createdAt -updatedAt -__v',
  }).populate({
    path: 'creator',
    select:
      '-location -createdAt -updatedAt -role -gender -password -__v -active',
  });
  next();
});

ProductSchema.pre('aggregate', function (next) {
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
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'category',
      },
    },
    {
      $unwind: '$category',
    },
    {
      $unwind: '$creator',
    },
    {
      $project: {
        'creator.location': 0,
        'creator.updatedAt': 0,
        'creator.createdAt': 0,
        'creator.role': 0,
        'creator.gender': 0,
        'creator.password': 0,
        'creator.active': 0,
        'creator.__v': 0,
        'category.creator': 0,
        'category.createdAt': 0,
        'category.updatedAt': 0,
      },
    }
  );
  next();
});

const ProductModel = mongoose.model('Products', ProductSchema);

module.exports = ProductModel;

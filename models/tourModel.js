// require mongoose package
const mongoose = require('mongoose');
// require slugify package
const slugify = require('slugify');

// create schema for tours:
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'], //pass in an array instead to use validators
      unique: true,
      trim: true
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty']
    },
    ratingsAverage: {
      type: Number,
      default: 4.5
    },
    ratingsQunatity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String], //array of strings (references)
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean, // true if secret tour
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// define a virtual property:
tourSchema.virtual('durationWeeks').get(function() {
  // we need this keyword so use a regular function instead of an arrow function
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
// also called the (Pre Save Hook)
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// DOCUMENT MIDDLEWARE: post middleware not only has access to next but also to  the document that was just saved to the database.
tourSchema.post('save', function(doc, next) {
  // here we have the finished document
  console.log(doc);
  next();
});

// QUERY MIDDLEWARE
tourSchema.pre('/^find/', function(next) {
  // secrete tours will not be included - $ne = 'not equal'
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  // this will run after the query has executed, that's why it has access to the documents
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
  // this is an array; unshift adds to beginning of an arrya
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } }
  });
  console.log(this.pipeline);
  next();
});

// create a model out of that schema
const Tour = mongoose.model('Tour', tourSchema);

//export the Tour
module.exports = Tour;

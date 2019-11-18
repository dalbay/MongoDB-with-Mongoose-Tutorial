// use File System
//const fs = require('fs');
const Tour = require('./../models/tourModel');

// require the apiFeatures
const APIFeatures = require('./../utils/apiFeatures');

// Aliasing the API
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// ROUTE HANDLER for Tours

// get ALL Tours
exports.getAllTours = async (request, response) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), request.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    // SEND RESPONSE
    response.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    response.status(404).json({
      status: 'Fail',
      message: err
    });
  }
};

// get a Tour
exports.getTour = async (request, response) => {
  try {
    // examine router and see how we specify the id in the URL
    const tour = await Tour.findById(request.params.id);
    // same as above (findById is shorthand):
    //Tour.findOne({ _id: request.params.id });

    response.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    response.status(404).json({
      status: 'Fail',
      message: err
    });
  }
};

// create a Tour from the data that comes from the body:
exports.createTour = async (request, response) => {
  try {
    const newTour = await Tour.create(request.body);
    response.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    // the promise that was created (Tour.create()) and rejected will enter here!
    response.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

// update a Tour
exports.updateTour = async (request, response) => {
  try {
    // get document to update - await the result of the query
    const tour = await Tour.findByIdAndUpdate(request.params.id, request.body, {
      // query method optional params(mongoose docs)
      new: true, // returns new tour
      runValidators: true // retuns error if input type wrong.
    });

    response.status(200).json({
      status: 'success',
      data: {
        tour: tour // in ES6 all we write is -> tour
      }
    });
  } catch (err) {
    response.status(404).json({
      status: 'Fail',
      message: err
    });
  }
};

// delete a Tour
exports.deleteTour = async (request, response) => {
  try {
    await Tour.findByIdAndDelete(request.params.id);

    response.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    response.status(404).json({
      status: 'Fail',
      message: err
    });
  }
};

// HANDLER FOR AGGREGATE FUNCTIONS
exports.getTourStats = async (request, response) => {
  try {
    // if you don't await here, it returns an aggregate object instead
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          // _id: '$difficulty', // groups tours;
          //_id: null, // null is default
          numTours: { $sum: 1 }, // adds one for each tour
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: { avgPrice: 1 } // 1 for ascending
      }
      // {
      //   $match: { _id: { $ne: 'EASY' } } // leaves out
      // }
    ]);

    response.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
  } catch (err) {
    response.status(404).json({
      status: 'Fail',
      message: err
    });
  }
};

// another function using the aggregation pipeline.
// calculate the busiest month of a given year.
exports.getMonthlyPlan = async (request, response) => {
  try {
    // define the year - passed in with URL param
    const year = request.params.year * 1;
    // find the starting date for each tours; unwind and match
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates' // one tour for each date
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' }, // use mongoDB aggregation pipeline operators (what from where?)
          numToursStarts: { $sum: 1 }, // count tours
          tours: { $push: '$name' } // which tours - array
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: {
          _id: 0 // 0 will not show
        }
      },
      {
        $sort: { numToursStarts: -1 } // -1 for descending
      }
    ]);

    response.status(200).json({
      status: 'success',
      data: {
        plan
      }
    });
  } catch (err) {
    response.status(404).json({
      status: 'Fail',
      message: err
    });
  }
};

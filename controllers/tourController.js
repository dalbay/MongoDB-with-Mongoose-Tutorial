// use File System
const fs = require('fs');
const Tour = require('./../models/tourModel');

/*Testing purpose:(param middleware)
// middleware function to check id
exports.checkId = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  next();
};
*/

// ROUTE HANDLER for Tours

// get ALL Tours
exports.getAllTours = async (request, response) => {
  try {
    // BUILD QUERY
    const queryObj = { ...request.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach(el => delete queryObj(el));

    const query = Tour.find(queryObj);

    // // another way to filter:
    // const query = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // EXECUTE QUERY
    const tours = await query;

    //SEND RESPONSE
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

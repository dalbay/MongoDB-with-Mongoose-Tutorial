// import the express module
const express = require('express');

// create new router for the tours
const router = express.Router();

// import tourController (route handlers)
const tourController = require('./../controllers/tourController');

// (to define parameter middleware use param function like this):
//router.param('id', tourController.checkId);

// create a new route for Aliasing
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

// create a new route for matching and grouping (AGGREGATE Pipeline)
router.route('/tour-stats').get(tourController.getTourStats);
// create a new route (AGGREGATE Pipeline)
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
// use router:
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

// when we have only one thing to export we use module.export
module.exports = router;

// import the express module
const express = require('express');

// import the userController
const userController = require('./../controllers/userController');

// create a new router for the users
const router = express.Router();

// use that router:
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

// when we have only one thing to export we use module.export
module.exports = router;

# MongoDB-with-Mongoose-Tutorial
- Connecting MongoDB database with the application with the Mongose Library (makes working with MongoDB in Node.js easy)
- Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js, a higher level of abstraction.
- Mongoose allows for rapid and simple development of mongod database interactions
- Features: schemas to model data and relationships, easy data validation, simple query API, middleware, etc;
- ***Mongoose schema***:where we model our data, by describing the structure of the data, default values, and validation;
- ***Mongoose model***: a wrapper for the schema, providing an interface to the database for CRUD options. A model is like a *blue print* - *classes*
<br/>

## Connecting Our Database with the Express App
- get your connection string from Atlas Connect -> Connect Your Application -> Copy
- paste it the your config file config.env ```DATABASE=mongodb+srv://aygun:<password>@cluster0-hhfve.mongodb.net/test?retryWrites=true&w=majority```
- Add the password and database to the connection string  
  Change <password> to <PASSWORD>; 
  Change test to natours
- If you are using the local database create another variable in the config file ```DATABASE_LOCAL=mongodb://localhost:27017/natours```  
  In order for the local to work run your mongodb server ```mongod.exe``` in the terminal.
- next, install a mongodb driver - for node.js to interact with mongodb - ***Mongoose***  
- install Mongoose (version 5)- ```npm i mongoose@5```
- go to server.js (where we do the set up for the application); this is where we also going to configure MongoDB;
- require Mongoose package - ```const mongoose = require('mongoose');```
- use the variable and connect to mongose and pass in the connection string along with an object with some options(if you write you own app just pass in the same options)  
  before we pass in the connection string replace the password
- the connect() method is going to return a promise which gets access to a connection object (result value of the promise); use it ```then()```. Console log the object and see if we have a connection; we assume that everything works fine and didn't implement any error handling.
```JavaScript
// change the password in the connection string
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
// connect to mongoose:
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(con => {
    console.log(con.connections);
    console.log('DB connection successful');
  });
```  
Run the application and examine the connection object - ```npm run start:dev```  
```JSON
. . .
    name: 'admin',
    host: 'cluster0-shard-00-00-hhfve.mongodb.net',
    port: 27017,
    user: 'aygun',
    pass: 'NIhKQ9tWYkxxxx',
    db:
     Db {
       _events: [Object],
       _eventsCount: 3,
       _maxListeners: undefined,
       s: [Object],
       serverConfig: [Getter],
       bufferMaxEntries: [Getter],
       databaseName: [Getter] } } ]
DB connection successful
```  
- clear the promise from the connection object and just console log a message  
```JavaScript
  .then(() => console.log('DB connection successful'));
```  
- to connect to a local database - replace the hosted database version ```.connect(DB, {``` with the local database version``` .connect(process.env.DATABASE_LOCAL, {```.  
(For the next section empty the database - Go to Atlas -> Collections -> Delete (tours))  
<br/>

## Creating a Simple Tour Model
- for now code in server.js, this will later be placed in a different file:
- we create models in mongoose in order to create documents using it and also to perform CRUD operations on it.
- to create a model we need a schema(describe data, set default values, validate the data,...)
- create a schema for tours:
```JavaScript
// create schema for tours:
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'], //pass in an array instead to use validators
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  }
});
```  
- Create a model out of that schema:
```JavaScript
// create a model out of that schema
const Tour = mongoose.model('Tour', tourSchema);
```  
<br/> 

## Creating Documents (in code) and Testing the Model
- create a variable, this will  be a new document created out of the Tour model 
```JavaScript
// create a document of Tour (instance of Tour)
const testTour = new Tour({
  name: 'The Forest Hicker',
  rating: 4.7,
  price: 497
});
```  
- This instance of the Tour model which has now a couple of methods that we can use in order to interact with the database.  
```JavaScript
// interact with the database (the save method returns a promise that we can then consume - later we will be using async/await in order to consume these promises)
testTour
  .save()
  .then(doc => {
    console.log(doc);
  })
  .catch(err => {
    console.log('Error!', err);
  });
```  
Run the application; the console will display the document that was just saved in the database:  
```JSON
DB connection successful
{ rating: 4.7,
  _id: 5db9e143e89cd960b0ca5ba1,
  name: 'The Forest Hicker',
  price: 497,
  __v: 0 }
``` 
- move over to Atlas and look at our database - you will see that the Collection and document are created and saved. (DISPLAY IT IN COMPASS!!)
![Atlas display db](images/mongoose1.png)  
<br/>

## Intro to Back-End Architecture: MVC, Types of Logic, and More
![MVC Architecture](images/mongoose2.png)  
![MVC Architecture](images/mongoose3.png)  
### Refactoring to MVC
- We already have the controller and routes folder. Create a models folder and add a tourModel.js file to it.
- copy and past tourSchema, mongoose from the server.js to this file. Export the Tour at the end.  
 
<br/>

**Model - tourModel.js**:  

```JavaScript
// require mongoose package
const mongoose = require('mongoose');

// create schema for tours:
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'], //pass in an array instead to use validators
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  }
});

// create a model out of that schema
const Tour = mongoose.model('Tour', tourSchema);

//export the Tour
module.exports = Tour;
```  
- we will need the Tour in the controller where we going to do the CRUD operations. Import the model in the tourController.js (API).
- recap that, as soon as we get a post request in the tourRoutes.js the createTour functions in the tourController.js will be hit:  
***tourRoutes.js file:***
```JavaScript
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
```   
***tourController.js***- this will create a tour from the data that comes from the body:   
```JavaScript
// Create a Tour from the data that comes from the body:
/*
- One way to create a tour:
	const newTour = new Tour({});
	newTour.save();

- Another way to create a tour:
here we call the create method on the model itself; also notice that instead of using promisses with .then(), we are are using asynch/await and save the result value of the promise in a variable; also pass in some real data into the create method. Note that with async/await you have to use try/catch to test for errors */
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
```


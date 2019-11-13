# MongoDB-with-Mongoose-Tutorial
- Connecting MongoDB database with the application and with the Mongose Library (working with MongoDB in Node.js easier)
- Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js, a higher level of abstraction.
- Mongoose allows for rapid and simple development with MongoDB interactions
- Features: schemas to data model and relationships, easy data validation, simple query API, middleware, etc;
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

---
# Build the API with a Database

## Intro to Back-End Architecture: MVC, Types of Logic, and More
![MVC Architecture](images/mongoose2.png)  
![MVC Architecture](images/mongoose3.png)  
### Refactoring to MVC
- We already have the controller and routes folder. Create a models folder and add a tourModel.js file to it.
- copy and past tourSchema, mongoose from the server.js to this file. Export the Tour at the end.  
 

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
## Create Documents
- Import the tour model to the tourController.js - (API).
- We will be using **Mongoose's Query Methods** - ```findById```, ```findByIdAndUpdate```,... *(look up mongoose documnetation)*.
- recap that, as soon as we get a post request in the tourRoutes.js the createTour functions in the tourController.js will be hit:  

***tourRoutes.js file:***  

```JavaScript
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
```   
***tourController.js*** - this will create a tour from the data that comes from the body:   
```JavaScript
// Create a Tour from the data that comes from the body:
/*
- One way to create a tour:
	const newTour = new Tour({});
	newTour.save();

- Another way to create a tour:
call the create method on the model itself; notice that instead of using promises with .then() function,
we are are using asynch/await and save the result value of the promise in a variable; 
also pass in some real data into the create method. 
Note that with async/await you have to use try/catch to test for errors */
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
Test you application with postman -  
- You don't see diffuculty and duration created, because they are not in your schema and therefore not put into the database.  
![MVC Architecture](images/mongoose4.png)  
- Open Mongoose and check out the entry  
![Mongoose entry](images/mongoose5.png)  

## Reading Documents  
- implement and getTours and getAllTours route handler  
tourController.js - getAllTours.js:  
```JavaScript
// get ALL Tours
exports.getAllTours = async (request, response) => {
  try {
    // use the models find method - gets all data in Tour collection
    const tours = await Tour.find();

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
```  
Test getAllTours handler in postman:   
![getAllTours reading from db](images/mongoose6.png)  

Next, implement the getTour handler:  
```JavaScript
// get a Tour
exports.getTour = async (request, response) => {
  try {
    // examine router and see how we specify the id in the URL
    const tour = await Tour.findById(request.params.id);
    // same as above (with filter object):
    // Tour.findOne({ _id: request.params.id });

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
```  
Test getTour handler in postman:   
![getTour reading from db](images/mongoose7.png)  
<br/>  

## Updating Documents:  
```JavaScript
// update a Tour
exports.updateTour = async (request, response) => {
  try {
    // get document to update - await the result of the query
    const tour = await Tour.findByIdAndUpdate(request.params.id, request.body, {
      // query method optional params(mongoose docs)
      new: true,  // returns new tour
      runValidators: true // retuns error if input type wrong.
    });

    response.status(200).json({
      status: 'success',
      data: {
        tour: tour  // in ES6 all we write is -> tour
      }
    });
  } catch (err) {
    response.status(404).json({
      status: 'Fail',
      message: err
    });
  }
};
```  
![getTour reading from db](images/mongoose9.png)  
<br/>

## Deleting Documents:  
```JavaScript
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
```  
<br/>

## Modelling the Tours
- We will update the tourSchema since we have a lot more data about a tour in reality - ```https://www.natours.dev/api/v1/tours/```
- Here is the updated Schema (tourModel.js) that accepts more properties as an input 
```JavaScript
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'], //pass in an array instead to use validators
    unique: true,
    trim: true
  },
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
    default: Date.now()
  },
  startDates: [Date]
});
```  
Now, when we can create a new tour in Postman that accepts more data; and save it on the database. Here is an example tour :  
```JSON
            {
                "ratingsAverage": 4.7,
                "ratingsQunatity": 0,
                "images": [
                    "tour-1-1.jpg",
                    "tour-1-2.jpg",
                    "tour-1-3.jpg"
                ],
                "createdAt": "2019-11-11T19:43:51.670Z",
                "startDates": [
                    "2021-04-25T14:00:00.000Z",
                    "2021-07-20T14:00:00.000Z",
                    "2021-10-05T14:00:00.000Z"
                ],
                "_id": "5dc9ba86084d306b9c12233c",
                "name": "The Forest Hiker",
                "duration": 5,
                "maxGroupSize": 25,
                "difficulty": "easy",
                "price": 397,
                "summary": "Breathtaking hike through the Canadian Banff National Park",
                "description": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                "imageCover": "tour-1-cover.jpg",
                "__v": 0
            }
```  
---
### Importing Development Data (Reading from JSON file and saving to MongoDB)
**Note**: this exercize is independed of the rest of the express application.
- we are adding this script file to dev-data -> data -> import-dev-data.js
```JavaScript
// require the fileSystem module (to access the JSON file)
const fs = require('fs');

// require mongoose package
const mongoose = require('mongoose');

// require the environmetal variable module
const dotenv = require('dotenv');

// require the tourModel (we will write to tours)
const Tour = require('../../models/tourModel');

// read and save the environmental variables in node.js
dotenv.config({ path: './config.env' });

// access the database only once; change password in connection string
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
  .then(() => console.log('DB connection successful'));

//READ JSON file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded');
  } catch (err) {
    console.log(err);
  }
};

// DELETE  ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted');
  } catch (err) {
    console.log(err);
  }
};

/* Executing Code in the Comment Line
   - instead of a functions call (importData(), deleteData()) we will interact with the comment line
   - note that we can access the arguments in comment line with process.argv:
console.log(process.argv);
*/
```  
Run the application in another terminal and add another argument at the end - ```> node dev-data/data/import-dev-data.js --import```  
The output on the console will be these 3 lines of ```process.argv``` arguments:  
```JavaScript
[ 'C:\\Program Files\\nodejs\\node.exe',  'C:\\Users\\aygun\\OneDrive\\Documents\\GitHub\\Express_Tutorial\\dev-data\\data\\import-dev-data.js',
  '--import' ]
```  

---







# MongoDB-with-Mongoose-Tutorial
- Connecting MongoDB database with the application with the Mongose Library (makes working with MongoDB in Node.js easy)
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


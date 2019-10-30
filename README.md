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

// require mongoose package
const mongoose = require('mongoose');

// require the environmetal variable module
const dotenv = require('dotenv');

// read and save the environmental variables in node.js
dotenv.config({ path: './config.env' });
// require express application
const app = require('./app'); // since its our own module we need to use ./ for current folder.

// change the password in the connection string
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// connect to mongoose:
mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful'));

// START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

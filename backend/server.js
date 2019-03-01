const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
// const Data = require("./data");

const API_PORT = 3001;
const app = express();
const router = express.Router();

// // this is our MongoDB database
// const dbRoute = "mongodb://localhost:27017/testDB";

// // connects our back end code with the database
// mongoose.connect(dbRoute);

/////////

//Set up default mongoose connection
var dbRoute = "mongodb://localhost:27017/testDB";
mongoose.connect(dbRoute, { useNewUrlParser: true });
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define schema
var Schema = mongoose.Schema;

var DataSchema = new Schema(
  {
    id: Number,
    message: String
  },
  { timestamp: true }
);

// Compile model from schema
var Data = mongoose.model('Data', DataSchema );

// Create an instance of model SomeModel
var awesome_instance = new Data({ id: "007", message: "random-test" });

// Save the new model instance, passing a callback
awesome_instance.save(function (err) {
  if (err) return handleError(err);
  // saved!
});


/////////

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

// this is our get method
// this method fetches all available data in our database
router.get("/getData", (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// this is our update method
// this method overwrites existing data in our database
router.post("/updateData", (req, res) => {
  const { id, update } = req.body;
  Data.findOneAndUpdate(id, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// this is our delete method
// this method removes existing data in our database
router.delete("/deleteData", (req, res) => {
  const { id } = req.body;
  Data.findOneAndDelete(id, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// this is our create methid
// this method adds new data in our database
router.post("/putData", (req, res) => {
  let data = new Data();

  const { id, message } = req.body;

  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  data.message = message;
  data.id = id;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
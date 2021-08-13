const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//creating the database schema
const campgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

//Exporting the Model to be used
module.exports = mongoose.model('campground', campgroundSchema);
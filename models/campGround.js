const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

//creating the database schema
const campgroundSchema = new Schema({
    title: String,
    price: Number,
    image: String,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

campgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }

        });
    }
});

//Exporting the Model to be used
module.exports = mongoose.model('campground', campgroundSchema);
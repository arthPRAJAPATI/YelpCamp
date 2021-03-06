const { number } = require('joi');
const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
        url: String,
        filename: String
})

ImageSchema.virtual('thumbnail').get(function() {
    this.url.replace('/upload', '/upload/w_200');
})


const opts = { toJSON : {virtuals: true}};
//creating the database schema
const campgroundSchema = new Schema({
    title: String,
    price: Number,
    images:  [
       ImageSchema
    ],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        }, 
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

campgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }

        });
    }
});


campgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `<strong><a href=/campgrounds/${this._id}>${this.title}</a><strong><p>${this.description.substring(0, 20)}...</p>`;
})

//Exporting the Model to be used
module.exports = mongoose.model('campground', campgroundSchema);
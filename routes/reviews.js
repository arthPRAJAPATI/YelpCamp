const express = require('express');
const router = express.Router({ mergeParams: true });
const ExpressError = require('../Utils/ExpressError');
const catchAsync = require('../Utils/AsyncWrapper');
const campGround = require('../models/campGround');
const Review = require('../models/review');

const {
    reviewSchema
} = require('../validationSchemas');

const reviewValidation = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};


//routing for review 
router.post('/', reviewValidation, catchAsync(async (req, res) => {
    const campground = await campGround.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'create new review');
    res.redirect(`/campgrounds/${campground._id}`);
}));

//routing to delete Review 
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await campGround.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted the review');
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;
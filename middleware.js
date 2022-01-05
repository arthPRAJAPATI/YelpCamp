const ExpressError = require('./Utils/ExpressError');
const {
    campgroundSchema
} = require('./validationSchemas');
const campGround = require('./models/campGround');
const Review = require('./models/review');
const {
    reviewSchema
} = require('./validationSchemas');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be Signed in');
        return res.redirect('/login');
    }
    next();
};

// form validation Middleware
module.exports.campGroundValidation = (req, res, next) => {

    const {
        error
    } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const camp = await campGround.findById(id);
    if (!camp.author.equals(req.user._id)) {
        req.flash('error', 'you are not allowed to edit this campground');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'you are not allowed to edit this campground');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

module.exports.reviewValidation = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

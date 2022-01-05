const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../Utils/AsyncWrapper');
const campGround = require('../models/campGround');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');
const { reviewValidation, isLoggedIn, isReviewAuthor } = require('../middleware');

//routing for review 
router.post('/', isLoggedIn, reviewValidation, catchAsync(reviews.createReview));

//routing to delete Review 
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
const express = require('express');
const router = express.Router();
const ExpressError = require('../Utils/ExpressError');
const catchAsync = require('../Utils/AsyncWrapper');
const campGround = require('../models/campGround');
const {
    campgroundSchema
} = require('../validationSchemas');

// form validation Middleware
const campGroundValidation = (req, res, next) => {

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


//routing to campgrounds view page CRUD: Read
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await campGround.find({});
    res.render('campgrounds/index', {
        campgrounds
    });
}));

//routing to campgorund create page CRUD: Create
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});

//routing the post request from form 
router.post('/', campGroundValidation, catchAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid campground Data', 400);

    const campground = new campGround(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));


//routing to campground details page CRUD: Read
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await campGround.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', {
        campground
    });
}));


//routing to edit campground details CRUD: Update
router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await campGround.findById(req.params.id);
    res.render('campgrounds/edit', {
        campground
    });
}));

//routing for put request on update
router.put('/:id', campGroundValidation, catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    const campground = await campGround.findByIdAndUpdate(id, {
        ...req.body.campground
    });
    res.redirect(`/campgrounds/${campground._id}`);
}));

//routing for delete request CRUD: Delete
router.delete('/:id', catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    await campGround.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

module.exports = router;
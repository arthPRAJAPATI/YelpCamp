const express = require('express');
const router = express.Router();

const catchAsync = require('../Utils/AsyncWrapper');
const campGround = require('../models/campGround');
const { isLoggedIn, isAuthor, campGroundValidation } = require('../middleware');


//routing to campgrounds view page CRUD: Read
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await campGround.find({});
    res.render('campgrounds/index', {
        campgrounds
    });
}));

//routing to campgorund create page CRUD: Create
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

//routing the post request from form 
router.post('/', isLoggedIn, campGroundValidation, catchAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid campground Data', 400);
    const campground = new campGround(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campgrounds');
    res.redirect(`/campgrounds/${campground._id}`);
}));


//routing to campground details page CRUD: Read
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await campGround.findById(req.params.id).populate('reviews').populate('author');
    if (!campground) {
        req.flash('error', 'cannot find the campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {
        campground
    });
}));


//routing to edit campground details CRUD: Update
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const campground = await campGround.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'cannot find the campground');
        return res.render('/campgrounds');
    }
    req.flash('success', 'Successfully updated the campgrounds');
    res.render('campgrounds/edit', { campground });
}));

//routing for put request on update
router.put('/:id', isLoggedIn, isAuthor, campGroundValidation, catchAsync(async (req, res) => {
    const { id } = req.params;

    const campground = await campGround.findByIdAndUpdate(id, {
        ...req.body.campground
    });
    res.redirect(`/campgrounds/${campground._id}`);
}));

//routing for delete request CRUD: Delete
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    await campGround.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground');
    res.redirect('/campgrounds');
}));

module.exports = router;
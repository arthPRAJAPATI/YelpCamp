const campGround = require('../models/campGround');

module.exports.index = async (req, res) => {
    const campgrounds = await campGround.find({});
    res.render('campgrounds/index', {
        campgrounds
    });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createNewCampground = async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid campground Data', 400);
    const campground = new campGround(req.body.campground);
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    console.log(req.files);
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made a new campgrounds');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req, res) => {
    const campground = await campGround.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
        }).populate('author');
    if (!campground) {
        req.flash('error', 'cannot find the campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {
        campground
    });
}

module.exports.renderEditForm = async (req, res) => {
    const campground = await campGround.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'cannot find the campground');
        return res.render('/campgrounds');
    }
    req.flash('success', 'Successfully updated the campgrounds');
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await campGround.findByIdAndUpdate(id, {
        ...req.body.campground
    });
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const {
        id
    } = req.params;
    await campGround.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground');
    res.redirect('/campgrounds');
}
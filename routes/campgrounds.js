const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../Utils/AsyncWrapper');
const campGround = require('../models/campGround');
const { isLoggedIn, isAuthor, campGroundValidation } = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});


//routing to campgrounds view page CRUD: Read
router.route('/')
  .get(catchAsync(campgrounds.index))
  //routing the post request from form 
  .post(isLoggedIn, upload.array('image'), /*campGroundValidation,*/ catchAsync(campgrounds.createNewCampground));

//routing to campgorund create page CRUD: Create
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

//routing to campground details page CRUD: Read
router.route('/:id')
.get( catchAsync(campgrounds.showCampground))
//routing for put request on update
.put(isLoggedIn, isAuthor, upload.array('image'), /*campGroundValidation,*/ catchAsync(campgrounds.updateCampground))
//routing for delete request CRUD: Delete
.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

//routing to edit campground details CRUD: Update
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;
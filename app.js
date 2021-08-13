const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const app = express();
const campGround = require('./models/campGround');

//Setting view engine to ejs files
app.set('view engine', 'ejs');

//setting pathname for views so it is access from any folder
app.set('views', path.join(__dirname,'views'));

//setting urlParsing to see the request body
app.use(express.urlencoded({extended: true}));

//setting methodOverride string 
app.use(methodOverride('_method'));

//logic to connect to database
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

//checking for success in database connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connection Successful");
});

//routing to campgrounds view page CRUD: Read
app.get('/campgrounds', async (req, res) => { 
    const campgrounds = await campGround.find({});
    res.render('campgrounds/index', {campgrounds});
});

//routing to campgorund create page CRUD: Create
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

//routing the post request from form 
app.post('/campgrounds', async (req, res) => {
    const campground = new campGround(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});

//routing to campground details page CRUD: Read
app.get('/campgrounds/:id', async (req, res) => { 
    const campground = await campGround.findById(req.params.id);
    res.render('campgrounds/show', {campground});
});

//routing to edit campground details CRUD: Update
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await campGround.findById(req.params.id);
    res.render('campgrounds/edit', {campground});
});

//routing for put request on update
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await campGround.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
});

//routing for delete request CRUD: Delete
app.delete('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    await campGround.findByIdAndDelete(id);
    res.redirect('/campgrounds');
});

//routing to home page 
app.get('/', (req, res) => {
    res.render('home');
});

//creating the server on PORT 3000
app.listen(3000, () => {
    console.log('Listening on Port 3000');
});
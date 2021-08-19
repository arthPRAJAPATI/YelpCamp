const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ExpressError = require('./Utils/ExpressError');
const ejsMate = require('ejs-mate');
const path = require('path');
const app = express();

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

//Setting view engine to ejs files
app.set('view engine', 'ejs');

//setting pathname for views so it is access from any folder
app.set('views', path.join(__dirname, 'views'));

//setting urlParsing to see the request body
app.use(express.urlencoded({
    extended: true
}));

//setting engine for ejs as ejs-mate
app.engine('ejs', ejsMate);

//setting methodOverride string 
app.use(methodOverride('_method'));

//setting express to serve public directory
app.use(express.static(path.join(__dirname, 'public')));

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

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);


//Error Handling
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

//Error Handling 
app.use((err, req, res, next) => {
    const {
        statusCode = 500
    } = err;
    if (!err.message) err.message = 'Somthing is wrong';
    res.status(statusCode).render('error', {
        err
    });

});

//creating the server on PORT 3000
app.listen(3000, () => {
    console.log('Listening on Port 3000');
});
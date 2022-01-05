if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ExpressError = require('./Utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const ejsMate = require('ejs-mate');
const path = require('path');
const app = express();
const passport = require('passport');
const localStrategy = require('passport-local');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/user');
const user = require('./models/user');


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

//defining the session- config
const sessionConfig = {
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

// Middleware for flash 
app.use((req, res, next) => {
    res.locals.CurrentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

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
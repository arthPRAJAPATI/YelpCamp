const express = require('express');
const router = express.Router();
const catchAsync = require('../Utils/AsyncWrapper');
const User = require('../models/user');
const users = require('../controllers/users');
const Passport = require('passport');

router.route('/register')
.get( users.renderRegisterForm)
.post( catchAsync(users.registerUser));

router.route('/login')
.get(users.RenderLoginForm)
.post(Passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginUser);

router.get('/logout', users.logoutUser);


module.exports = router;
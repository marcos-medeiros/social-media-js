const router = require('express').Router();
const passport = require('../auth');

const chatsController = require('../controllers/chatsController');
const friendshipsController = require('../controllers/friendshipsController');
const postsController = require('../controllers/postsController');
const usersController = require('../controllers/usersController');

// USER

// create user
router.post('/users', usersController.create);

// log in user
router.post('/login', usersController.login);

// get user details
router.get('/users', usersController.details);

// POST

// get all posts

// get post details

// create post

// delete post


// CHAT

// get chat

// send message


// FRIENDSHIP

// get friends

// get requests sent

// get pending requests

// accept friendship

// decline/delete friendship


module.exports = router;
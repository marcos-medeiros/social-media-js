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
router.get('/posts', postsController.all);

// create post
router.get('/posts', postsController.create);

// delete post
router.get('/posts', postsController.delete);


// CHAT

// get chat

// send message


// FRIENDSHIP

// get friends

// create friend request

// get requests sent

// get pending requests

// accept friendship

// decline/delete friendship


module.exports = router;
const router = require('express').Router();
const passport = require('../auth');

const commentsController = require('../controllers/commentsController');
const friendshipsController = require('../controllers/friendshipsController');
const postsController = require('../controllers/postsController');
const usersController = require('../controllers/usersController');
const likesController = require('../controllers/likesController');


// USER

// create user
router.post('/users', usersController.create);

// log in user
router.post('/login', usersController.login);

// list of all users
router.get('/users', usersController.all)

// get user details
router.get('/users/:id', usersController.details);


// POST

// get all posts
router.get('/posts', postsController.all);

// create post
router.get('/posts', postsController.create);

// delete post
router.post('/posts/:id', postsController.delete);


// COMMENT

// create comment
router.post('/comments', commentsController.create);

// delete comment
router.post('/comments/:id', commentsController.delete);


// LIKE

// create like
router.post('/likes', likesController.create);

// delete like
router.post('/likes/:id',likesController.delete);


// FRIENDSHIP

// get list of all friends
router.get('/friends', friendshipsController.all);

// get requests
router.get('/requests', friendshipsController.requests);

// create friend request
router.post('/requests', friendshipsController.create);

// accept friendship
router.post('/requests/:id/accept', friendshipsController.accept);

// decline/delete friendship
router.post('/requestsp/:id/delete', friendshipsController.delete);


module.exports = router;
const async = require('async');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const passport = require('../auth');
const User = require('../models/user');
const Post = require('../models/post');
const Friendship = require('../models/friendship');


// create user
exports.create = [
    // Validate fields.
    body('firstName').trim().isLength({ min: 1 }).withMessage('First name must be specified.')
        .isLength({ max: 50 }).withMessage('First name has must not exceed 50 characters.'),
    body('lastName').trim().isLength({ min: 1 }).withMessage('Last name must be specified.')
        .isLength({ max: 50 }).withMessage('Last name has must not exceed 50 characters.'),
    body('email').trim().isLength({ min: 1 }).withMessage('Email must be specified.'),
    body('password').trim().isLength({ min: 1 }).withMessage('Password must be specified. ')
        .isLength({ max: 30 }).withMessage('Password must not exceed 30 characters'),
    body('passwordConfirmation').custom((value, { req }) => {
        if (value !== req.body.password) throw new Error('Password confirmation does not match password');
    }),

    // Sanitize fields.
    sanitizeBody('*').escape(),

    (req, res, next) => {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            // if err, do something
            if (err) next(err);

            // Extract the validation errors from a request.
            const errors = validationResult(req);

            // There are errors so send back the errors.
            if (!errors.isEmpty()) res.json(errors);
            else {
                // Data from form is valid.
                const user = new User({
                    firstName = req.body.firstName,
                    lastName = req.body.lastName,
                    email: req.body.email,
                    password: hash
                }).save((err, user) => {
                    if (err) return next(err);
                    res.json(user);
                });
            }
        });
    }
];

// log in user
exports.login = (req, res, next) => {
    passport.authenticate("local", (err, user) => {
        if (err) next(err);
        res.json(user);
    });
}

// get user details
exports.details = (req, res, next) => [
    sanitizeBody('*').escape(),
    async.parallel({
        user: (callback) => {
            User
                .findById(req.body.id)
                .exec(callback);
        },
        posts: (callback) => {
            Post
                .find({ user: req.body.id })
                .exec(callback);
        },
        friends: (callback) => {
            Friendship
                .find({ user: req.body.id })
                .exec(callback);
        }
    }, (err, result) => {
        if (err) next(err);
        res.json({
            name: result.user.name,
            posts: result.posts,
            friends: result.friends.map(f => f.name)
        });
    })
];
const async = require('async');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const Post = require('../models/post');
const user = require('../models/user');

exports.all = (req, res, next) => {
    Post
        .find({})
        .populate('user')
        .exec((err, posts) => {
            if (err) next(err);
            res.json(posts);
        });
};

exports.create = [
    // Validate fields
    body('content').trim().isLength({ min: 1 }).withMessage('Content must be specified.')
        .isLength({ max: 255 }).withMessage('Content must not exceed 255 characters.'),
    body('userId').trim().isLength({ min: 1 }).withMessage('User invalid'),

    // Sanitize fields.
    sanitizeBody('*').escape(),

    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // There are errors so send back the errors.
        if (!errors.isEmpty()) res.json(errors);
        else {
            // Data from form is valid.
            User.findOne(req.body.userId)
                .exec((err, user) => {
                    if (err) next(err);
                    new Post({
                        content: req.body.content,
                        user: user.id,
                    }).save((err, post) => {
                        if (err) return next(err);
                        res.json(post);
                    });
                })
        }
    }
];

exports.delete = [
    // Validate and sanitize fields
    body('postId').trim().isLength({ min: 1 }).withMessage('Post invalid'),
    sanitizeBody('*').escape(),

    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // There are errors so send back the errors.
        if (!errors.isEmpty()) res.json(errors);
        else {
            Post
                .findOneAndDelete({ user: req.user.id, id: req.body.postId })
                .exec((err) => {
                    if (err) next(err);
                    res.end();
                })
        }
    }
];
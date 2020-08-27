const async = require('async');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const Like = require('../models/like');

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

exports.all = (req, res, next) => {
    Post
        .find({})
        .populate('user')
        .exec((err, posts) => {
            if (err) next(err);
            for (let i = 0; i < posts.length; i++) {
                async.parallel({
                    comments: (callback) => {
                        Comment
                            .find({ post: posts[i].id })
                            .exec(callback);
                    },
                    likes: (callback) => {
                        Like
                            .find({ post: posts[i].id })
                            .exec(callback);
                    }
                }, (err, results) => {
                    if (err) next(err);
                    posts[i].comments = results.comments;
                    posts[i].likes = result.likes.length;
                });
            }
            res.json(posts);
        });
};

exports.delete = (req, res, next) => {
    Post
        .findOneAndDelete({ user: req.user.id, id: req.params.id })
        .exec((err) => {
            if (err) next(err);
            res.end();
        });
};
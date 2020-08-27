const async = require('async');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const User = require('../models/user');
const Like = require('../models/like');
const Post = require('../models/post');

exports.create = [
    body('userId').trim().isLength({ min: 1 }).withMessage('User invalid'),
    body('postId').trim().isLength({ min: 1 }).withMessage('Post invalid'),
    sanitizeBody('*').escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty) res.json(errors);
        else {
            async.parallel({
                user: (callback) => {
                    User
                        .findById(req.body.userId)
                        .exec(callback);
                },
                post: (callback) => {
                    Post
                        .findById(req.body.postId)
                        .exec(callback);
                }
            }, (err, results) => {
                if (err) next(err);
                new Like({
                    user: results.user.id,
                    post: results.post.id
                }).save((err, like) => {
                    if (err) next(err);
                    res.json(like);
                });
            })
        }
    }
];

exports.delete = [
    body('userId').trim().isLength({ min: 1 }).withMessage('User invalid.'),
    sanitizeBody('*').escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty) res.json(errors);
        else {
            Like
                .findOneAndDelete({ user: req.body.userId, id: req.params.id })
                .exec((err) => {
                    if (err) next(err);
                    res.end();
                })
        }
    }
]
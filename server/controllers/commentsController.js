const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const User = require('../models/user');
const Comment = require('../models/comment');

exports.create = [
    body('content').trim().isLength({ min: 1 }).withMessage('Content must be specified.')
        .isLength({ max: 255 }).withMessage('Comment must not exceed 255 characters'),
    body('userId').trim().isLength({ min: 1 }).withMessage('User invalid'),
    sanitizeBody('*').escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty) res.json(errors);
        else {
            User.findOne(req.body.userId)
                .exec((err, user) => {
                    if (err) next(err);
                    new Comment({
                        content: req.body.content,
                        user: user.id,
                    }).save((err, comment) => {
                        if (err) return next(err);
                        res.json(comment);
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
            Comment
                .findOneAndDelete({ user: req.body.userId, id: req.params.id })
                .exec((err) => {
                    if (err) next(err);
                    res.end();
                })
        }
    }
]
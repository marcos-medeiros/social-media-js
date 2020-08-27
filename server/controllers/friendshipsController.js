const async = require('async');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const User = require('../models/user');
const Friendship = require('../models/friendship');

exports.all = [
    body('userId').trim().isLength({ min: 1 }).withMessage('User invalid'),
    sanitizeBody('*').escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty) res.json(errors);
        else {
            Friendship
                .find({ user: req.body.userId, status: true })
                .populate('friend')
                .exec((err, friends) => {
                    if (err) next(err);
                    res.json(friends);
                })
        }
    }
];

exports.requests = [
    body('userId').trim().isLength({ min: 1 }).withMessage('User invalid'),
    sanitizeBody('*').escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty) res.json(errors);
        else {
            async.parallel({
                sent: (callback) => {
                    Friendship
                        .find({ user: req.body.userId, status: false })
                        .populate('friend')
                        .exec(callback);
                },
                received: (callback) => {
                    Friendship
                        .find({ friend: req.body.userId, status: false })
                        .populate('user')
                        .exec(callback);
                }
            }, (err, results) => {
                if (err) next(err);
                res.json(results);
            })
        }
    }

]

exports.create = [
    body('userId').trim().isLength({ min: 1 }).withMessage('User invalid'),
    body('friendId').trim().isLength({ min: 1 }).withMessage('Friend invalid'),
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
                friend: (callback) => {
                    User
                        .findById(req.body.friendId)
                        .exec(callback);
                }
            }, (err, result) => {
                if (err) next(err);
                new Friendship({
                    user: results.friend.id,
                    friend: results.user.id
                }).save((err, friendship) => {
                    if (err) next(err);
                });

                new Friendship({
                    user: results.user.id,
                    friend: results.friend.id
                }).save((err, friendship) => {
                    if (err) next(err);
                    res.json(friendship);
                });
            })
        }
    }
]

exports.accept = [
    body('userId').trim().isLength({ min: 1 }).withMessage('User invalid'),
    sanitizeBody('*').escape(),
    (req, res, next) => {
        User
            .findById(req.body.userId)
            .exec((err, user) => {
                if (err) next(err);
                Friendship
                    .findOneAndUpdate({ id: req.params.id, user: user.id }, { status: true })
                    .exec((err, friendship) => {
                        if (err) next(err);
                        Friendship
                            .findOneAndUpdate({ user: friendship.friend, friend: friendship.user }, { status: true })
                            .exec(err => {
                                if (err) next(err);
                                res.json(friendship);
                            })
                    })
            })
    }
]

exports.delete = [
    body('userId').trim().isLength({ min: 1 }).withMessage('User invalid'),
    sanitizeBody('*').escape(),
    (req, res, next) => {
        User
            .findById(req.body.userId)
            .exec((err, user) => {
                if (err) next(err);
                Friendship
                    .findOneAndDelete({ id: req.params.id, user: user.id })
                    .exec((err, friendship) => {
                        if (err) next(err);
                        Friendship
                            .findOneAndDelete({ user: friendship.friend, friend: friendship.user })
                            .exec(err => {
                                if (err) next(err);
                                res.json(friendship);
                            })
                    })
            })
    }
]
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var validator = __importStar(require("express-validator"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var cloudinary_1 = __importDefault(require("cloudinary"));
var multer_1 = __importDefault(require("../services/multer"));
var user_1 = __importDefault(require("../models/user"));
var profile_1 = __importDefault(require("../models/profile"));
/*
 * GET / - Own profile, same as GET /<yourId>
 * POST / - Add a new user
 * GET /:id - Profile of some user
 * PATCH /:id - Update profile
 * DELETE /:id - Delete profile
*/
var UserController = /** @class */ (function () {
    function UserController() {
    }
    UserController.getPwdHash = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            var salt, hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, bcrypt_1.default.genSalt(10)];
                    case 1:
                        salt = _a.sent();
                        return [4 /*yield*/, bcrypt_1.default.hash(password, salt)];
                    case 2:
                        hash = _a.sent();
                        return [2 /*return*/, hash];
                }
            });
        });
    };
    UserController.uploadImage = function (image, userId) {
        return new Promise(function (resolve, reject) {
            cloudinary_1.default.v2.uploader.upload(image, { public_id: "odinbook_profile_images/" + userId, overwrite: true }, function (err, url) {
                if (err) {
                    return reject(err);
                }
                else {
                    return resolve(url);
                }
            });
        });
    };
    UserController.deleteImage = function (userId) {
        return new Promise(function (resolve, reject) {
            cloudinary_1.default.v2.uploader.destroy("odinbook_profile_images/" + userId, function (err, result) {
                if (err) {
                    return reject(err);
                }
                else {
                    return resolve(result);
                }
            });
        });
    };
    UserController.loadPosts = function (profileOwner, includeFriendPosts) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var profile, friendPromises, posts, err_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, profile_1.default
                                .findOne({ owner: profileOwner })
                                .populate({
                                path: "posts",
                                populate: [
                                    { path: "author", select: ["name", "picture"] },
                                    { path: "replies", populate: { path: "author", select: ["name", "picture"] } },
                                    { path: "replyCount" },
                                ],
                                options: { sort: { "dateposted": -1 } }
                            })
                                .exec()];
                    case 1:
                        profile = _c.sent();
                        if (!!profile) return [3 /*break*/, 2];
                        return [2 /*return*/, new Array()];
                    case 2:
                        if (!!includeFriendPosts) return [3 /*break*/, 3];
                        return [2 /*return*/, (_a = profile.posts) !== null && _a !== void 0 ? _a : new Array()];
                    case 3: return [4 /*yield*/, Promise.all((_b = profileOwner.friends) === null || _b === void 0 ? void 0 : _b.map(function (x) { return UserController.loadPosts(x); })).catch(function (err) { return err; })];
                    case 4:
                        friendPromises = _c.sent();
                        posts = friendPromises
                            .reduce(function (acc, val) { return acc.concat(val); }, profile.posts)
                            .sort(function (a, b) { return a.dateposted > b.dateposted ? -1 : a.dateposted < b.dateposted ? 1 : 0; });
                        return [2 /*return*/, posts !== null && posts !== void 0 ? posts : []];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        err_1 = _c.sent();
                        return [2 /*return*/, err_1];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    UserController.indexGet = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var user, posts, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, user_1.default.findById(req.user._id).exec()];
                    case 1:
                        user = _a.sent();
                        if (!user) return [3 /*break*/, 3];
                        return [4 /*yield*/, UserController.loadPosts(user, true)];
                    case 2:
                        posts = _a.sent();
                        res.render("profile_timeline", { user: user, posts: posts });
                        return [3 /*break*/, 4];
                    case 3:
                        res.status(404).redirect("/");
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_2 = _a.sent();
                        return [2 /*return*/, next(err_2)];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    UserController.registerGet = function (req, res, next) {
        res.render("register");
    };
    UserController.register = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var validationErrors, passHash, user, savedUser, profile, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        validationErrors = validator.validationResult(req);
                        if (!!validationErrors.isEmpty()) return [3 /*break*/, 1];
                        res.render("register", { errors: validationErrors.array() });
                        return [3 /*break*/, 5];
                    case 1: return [4 /*yield*/, UserController.getPwdHash(req.body.password)];
                    case 2:
                        passHash = _a.sent();
                        user = new user_1.default({
                            name: req.body.name,
                            email: req.body.email,
                            password: passHash
                        });
                        return [4 /*yield*/, user.save()];
                    case 3:
                        savedUser = _a.sent();
                        profile = new profile_1.default({ owner: savedUser });
                        return [4 /*yield*/, profile.save()];
                    case 4:
                        _a.sent();
                        res.redirect(307, "/user/login");
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        err_3 = _a.sent();
                        return [2 /*return*/, next(err_3)];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    UserController.profileGet = function (req, res, next) {
        if (req.params.page === "friends") {
            UserController.profileGetFriends(req, res, next);
        }
        else {
            UserController.profileGetPosts(req, res, next);
        }
    };
    UserController.allUsersGet = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var users, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, user_1.default.find().exec()];
                    case 1:
                        users = _a.sent();
                        if (!users) {
                            res.status(500).redirect("/");
                        }
                        else {
                            res.render("userlist", { users: users });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_4 = _a.sent();
                        return [2 /*return*/, next(err_4)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.profileGetPosts = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var user, profile, posts, friendStatus, _a, _b, err_5;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 12, , 13]);
                        return [4 /*yield*/, user_1.default.findById(req.params.id).exec()];
                    case 1:
                        user = _c.sent();
                        if (!!user) return [3 /*break*/, 2];
                        res.status(404).render("profile", { notFound: true });
                        return [3 /*break*/, 11];
                    case 2: return [4 /*yield*/, profile_1.default.findOne({ owner: user }).exec()];
                    case 3:
                        profile = _c.sent();
                        return [4 /*yield*/, UserController.loadPosts(user)];
                    case 4:
                        posts = _c.sent();
                        return [4 /*yield*/, user_1.default.findOne({ _id: req.params.id, friends: res.locals.currentUser }).exec()];
                    case 5:
                        if (!(_c.sent())) return [3 /*break*/, 6];
                        _a = "friend";
                        return [3 /*break*/, 10];
                    case 6: return [4 /*yield*/, user_1.default.findOne({ _id: req.params.id, sentFriendRequests: res.locals.currentUser }).exec()];
                    case 7:
                        _b = (_c.sent());
                        if (_b) return [3 /*break*/, 9];
                        return [4 /*yield*/, user_1.default.findOne({ _id: req.params.id, recvFriendRequests: res.locals.currentUser }).exec()];
                    case 8:
                        _b = (_c.sent());
                        _c.label = 9;
                    case 9:
                        _a = _b ? "pending"
                            : "none";
                        _c.label = 10;
                    case 10:
                        friendStatus = _a;
                        res.render("profile", { user: user, profile: profile, posts: posts, friendStatus: friendStatus });
                        _c.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        err_5 = _c.sent();
                        return [2 /*return*/, next(err_5)];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    UserController.profileGetFriends = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var user, profile, friendStatus, _a, _b, err_6;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 11, , 12]);
                        return [4 /*yield*/, user_1.default.findById(req.params.id)
                                .populate({ path: "friends", select: ["name", "picture"] })
                                .populate({ path: "recvFriendRequests", select: ["name", "picture"] })
                                .exec()];
                    case 1:
                        user = _c.sent();
                        if (!!user) return [3 /*break*/, 2];
                        res.status(404).render("profile", { notFound: true });
                        return [3 /*break*/, 10];
                    case 2: return [4 /*yield*/, profile_1.default.findOne({ owner: user })];
                    case 3:
                        profile = _c.sent();
                        return [4 /*yield*/, user_1.default.findOne({ _id: req.params.id, friends: res.locals.currentUser }).exec()];
                    case 4:
                        if (!(_c.sent())) return [3 /*break*/, 5];
                        _a = "friend";
                        return [3 /*break*/, 9];
                    case 5: return [4 /*yield*/, user_1.default.findOne({ _id: req.params.id, sentFriendRequests: res.locals.currentUser }).exec()];
                    case 6:
                        _b = (_c.sent());
                        if (_b) return [3 /*break*/, 8];
                        return [4 /*yield*/, user_1.default.findOne({ _id: req.params.id, sentFriendRequests: res.locals.currentUser }).exec()];
                    case 7:
                        _b = (_c.sent());
                        _c.label = 8;
                    case 8:
                        _a = _b ? "pending"
                            : "none";
                        _c.label = 9;
                    case 9:
                        friendStatus = _a;
                        res.render("profile_friends", { user: user, profile: profile, friendStatus: friendStatus });
                        _c.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        err_6 = _c.sent();
                        return [2 /*return*/, next(err_6)];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    UserController.sendFriendRequest = function (req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var friend, user, err_7;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 9, , 10]);
                        return [4 /*yield*/, user_1.default.findById(req.params.id).exec()];
                    case 1:
                        friend = _c.sent();
                        return [4 /*yield*/, user_1.default.findOne(req.user).exec()];
                    case 2:
                        user = _c.sent();
                        if (!(!friend || !user)) return [3 /*break*/, 3];
                        res.status(404).redirect("back");
                        return [3 /*break*/, 8];
                    case 3:
                        if (!(((_a = friend.recvFriendRequests) === null || _a === void 0 ? void 0 : _a.indexOf(user._id)) === -1)) return [3 /*break*/, 5];
                        return [4 /*yield*/, user_1.default.updateOne(friend, { $push: { recvFriendRequests: user } })];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5:
                        if (!(((_b = user.sentFriendRequests) === null || _b === void 0 ? void 0 : _b.indexOf(friend._id)) === -1)) return [3 /*break*/, 7];
                        return [4 /*yield*/, user_1.default.updateOne(user, { $push: { sentFriendRequests: friend } })];
                    case 6:
                        _c.sent();
                        _c.label = 7;
                    case 7:
                        next();
                        _c.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        err_7 = _c.sent();
                        return [2 /*return*/, next(err_7)];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    UserController.acceptFriendRequest = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var user, friend, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, user_1.default.findOne(req.user).exec()];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, user_1.default.findById(req.params.id).exec()];
                    case 2:
                        friend = _a.sent();
                        if (!(!friend || !user)) return [3 /*break*/, 3];
                        res.status(404).redirect("back");
                        return [3 /*break*/, 6];
                    case 3: return [4 /*yield*/, user_1.default.updateOne(user, {
                            $pull: { recvFriendRequests: friend === null || friend === void 0 ? void 0 : friend._id },
                            $push: { friends: friend }
                        })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, user_1.default.updateOne(friend, {
                                $pull: { sentFriendRequests: user._id },
                                $push: { friends: user }
                            })];
                    case 5:
                        _a.sent();
                        res.redirect("back");
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        err_8 = _a.sent();
                        return [2 /*return*/, next(err_8)];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    UserController.declineFriendRequest = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var user, friend, err_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, user_1.default.findOne(req.user).exec()];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, user_1.default.findById(req.params.id).exec()];
                    case 2:
                        friend = _a.sent();
                        if (!(!friend || !user)) return [3 /*break*/, 3];
                        res.status(404).redirect("back");
                        return [3 /*break*/, 6];
                    case 3: return [4 /*yield*/, user_1.default.updateOne(user, { $pull: { recvFriendRequests: friend === null || friend === void 0 ? void 0 : friend._id } })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, user_1.default.updateOne(friend, { $pull: { sentFriendRequests: user._id } })];
                    case 5:
                        _a.sent();
                        res.redirect("back");
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        err_9 = _a.sent();
                        return [2 /*return*/, next(err_9)];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    UserController.cancelFriendRequest = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var user, friend, err_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, user_1.default.findOne(req.user).exec()];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, user_1.default.findById(req.params.id).exec()];
                    case 2:
                        friend = _a.sent();
                        if (!(!friend || !user)) return [3 /*break*/, 3];
                        res.status(404).redirect("back");
                        return [3 /*break*/, 6];
                    case 3: return [4 /*yield*/, user_1.default.updateOne(user, {
                            $pull: { sentFriendRequests: friend._id, recvFriendRequests: friend._id }
                        })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, user_1.default.updateOne(friend, {
                                $pull: { sentFriendRequests: user._id, recvFriendRequests: user._id }
                            })];
                    case 5:
                        _a.sent();
                        res.redirect("back");
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        err_10 = _a.sent();
                        return [2 /*return*/, next(err_10)];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    UserController.unfriend = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var user, friend, err_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, user_1.default.findOne(req.user).exec()];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, user_1.default.findById(req.params.id).exec()];
                    case 2:
                        friend = _a.sent();
                        if (!(!friend || !user)) return [3 /*break*/, 3];
                        res.status(404).redirect("back");
                        return [3 /*break*/, 6];
                    case 3: return [4 /*yield*/, user_1.default.updateOne(user, { $pull: { friends: friend._id } })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, user_1.default.updateOne(friend, { $pull: { friends: user._id } })];
                    case 5:
                        _a.sent();
                        res.redirect("back");
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        err_11 = _a.sent();
                        return [2 /*return*/, next(err_11)];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    UserController.profileGetEdit = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var user, profile, err_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, user_1.default.findById(req.params.id).exec()];
                    case 1:
                        user = _a.sent();
                        if (!!user) return [3 /*break*/, 2];
                        res.status(404).redirect("back");
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, profile_1.default.findOne({ owner: user }).exec()];
                    case 3:
                        profile = _a.sent();
                        res.render("profile_edit", { user: user, profile: profile });
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_12 = _a.sent();
                        return [2 /*return*/, next(err_12)];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    UserController.profileUpdate = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var validationErrors, user, profile, passHash, _a, userChanges, profileChanges, image, err_13;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 15, , 16]);
                        validationErrors = validator.validationResult(req);
                        return [4 /*yield*/, user_1.default.findById(req.params.id).exec()];
                    case 1:
                        user = _b.sent();
                        return [4 /*yield*/, profile_1.default.findOne({ owner: user }).exec()];
                    case 2:
                        profile = _b.sent();
                        if (!(!user || !profile)) return [3 /*break*/, 3];
                        res.status(404).redirect("back");
                        return [3 /*break*/, 14];
                    case 3:
                        if (!!validationErrors.isEmpty()) return [3 /*break*/, 4];
                        res.render("profile_edit", { user: user, profile: profile, errors: validationErrors.array() });
                        return [3 /*break*/, 14];
                    case 4:
                        if (!req.body.password) return [3 /*break*/, 6];
                        return [4 /*yield*/, UserController.getPwdHash(req.body.password)];
                    case 5:
                        _a = _b.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        _a = undefined;
                        _b.label = 7;
                    case 7:
                        passHash = _a;
                        userChanges = {
                            name: req.body.name || user.name,
                            email: req.body.email || user.email,
                            password: passHash || user.password,
                            picture: user.picture || ""
                        };
                        profileChanges = {
                            status: req.body.status,
                        };
                        if (!(req.body.deleteImage && user.picture)) return [3 /*break*/, 9];
                        return [4 /*yield*/, UserController.deleteImage(user._id)];
                    case 8:
                        _b.sent();
                        userChanges.picture = "";
                        return [3 /*break*/, 11];
                    case 9:
                        if (!req.file) return [3 /*break*/, 11];
                        return [4 /*yield*/, UserController.uploadImage(multer_1.default.dataUri(req).content, user._id)];
                    case 10:
                        image = _b.sent();
                        userChanges.picture = image.secure_url;
                        _b.label = 11;
                    case 11: return [4 /*yield*/, user_1.default.updateOne(user, userChanges)];
                    case 12:
                        _b.sent();
                        return [4 /*yield*/, profile_1.default.updateOne(profile, profileChanges)];
                    case 13:
                        _b.sent();
                        res.redirect(user.url);
                        _b.label = 14;
                    case 14: return [3 /*break*/, 16];
                    case 15:
                        err_13 = _b.sent();
                        return [2 /*return*/, next(err_13)];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    UserController.userValidationChain = [
        validator.body("name").trim().isLength({ min: 3 }).withMessage("Name can't be less than 3 characters."),
        validator.body("email").trim()
            .isEmail().withMessage("Invalid email address")
            .custom(function (val) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_1.default.findOne({ email: val }).exec()];
                    case 1:
                        if (_a.sent()) {
                            throw new Error("A user with that email address already exists.");
                        }
                        else {
                            return [2 /*return*/, val];
                        }
                        return [2 /*return*/];
                }
            });
        }); }),
        validator.body("password").trim()
            .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long.")
            .custom(function (val, _a) {
            var req = _a.req;
            if (val !== req.body.confirmPassword) {
                throw new Error("Passwords don't match.");
            }
            else {
                return val;
            }
        })
    ];
    UserController.userUpdateValidationChain = [
        validator.body("name").trim().isLength({ min: 3 }).withMessage("Name can't be less than 3 characters."),
        validator.body("email").trim()
            .isEmail().withMessage("Invalid email address")
            .custom(function (val, _a) {
            var req = _a.req;
            return __awaiter(void 0, void 0, void 0, function () {
                var user;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, user_1.default.findOne({ email: val }).exec()];
                        case 1:
                            user = _b.sent();
                            if (user && !user.equals(req.user)) {
                                throw new Error("A user with that email address already exists.");
                            }
                            else {
                                return [2 /*return*/, val];
                            }
                            return [2 /*return*/];
                    }
                });
            });
        }),
        validator.body("currentPassword").trim()
            .custom(function (val, _a) {
            var req = _a.req;
            return __awaiter(void 0, void 0, void 0, function () {
                var user, match;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, user_1.default.findById((_b = req.params) === null || _b === void 0 ? void 0 : _b.id).exec()];
                        case 1:
                            user = _c.sent();
                            return [4 /*yield*/, bcrypt_1.default.compare(val, user.password)];
                        case 2:
                            match = _c.sent();
                            if (!match) {
                                throw new Error("Wrong password.");
                            }
                            else {
                                return [2 /*return*/, val];
                            }
                            return [2 /*return*/];
                    }
                });
            });
        }),
        validator.body("password").optional({ checkFalsy: true }).trim()
            .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long.")
            .custom(function (val, _a) {
            var req = _a.req;
            if (val !== req.body.confirmPassword) {
                throw new Error("Passwords don't match.");
            }
            else {
                return val;
            }
        })
    ];
    return UserController;
}());
exports.default = UserController;

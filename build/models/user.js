"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, minlength: 3 },
    email: { type: String, required: true, unique: true, minlength: 3 },
    password: { type: String, required: true },
    joindate: { type: Date, default: Date.now },
    picture: { type: String },
    friends: [{ type: mongoose_1.default.Types.ObjectId, ref: "User" }],
    sentFriendRequests: [{ type: mongoose_1.default.Types.ObjectId, ref: "User" }],
    recvFriendRequests: [{ type: mongoose_1.default.Types.ObjectId, ref: "User" }]
});
userSchema.virtual("url")
    .get((function () { return "/user/" + this._id; }));
userSchema.virtual("posts", {
    ref: "Post",
    localField: "_id",
    foreignField: "author"
});
var userModel = mongoose_1.default.model("User", userSchema);
exports.default = userModel;

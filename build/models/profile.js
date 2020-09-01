"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var profileSchema = new mongoose_1.default.Schema({
    owner: { type: mongoose_1.default.Types.ObjectId, ref: "User", required: true, unique: true },
    status: { type: String }
});
profileSchema.virtual("posts", {
    ref: "Post",
    foreignField: "author",
    localField: "owner",
    match: { parent: { $exists: false } }
});
var profileModel = mongoose_1.default.model("Profile", profileSchema);
exports.default = profileModel;

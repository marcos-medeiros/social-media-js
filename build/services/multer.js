"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var multer_1 = __importDefault(require("multer"));
var parser_1 = __importDefault(require("datauri/parser"));
var path_1 = __importDefault(require("path"));
var Multer;
(function (Multer) {
    Multer.storage = multer_1.default.memoryStorage();
    Multer.uploads = multer_1.default({ storage: Multer.storage }).single("image");
    Multer.dataUri = function (req) { return new parser_1.default().format(path_1.default.extname(req.file.originalname), req.file.buffer); };
})(Multer || (Multer = {}));
exports.default = Multer;

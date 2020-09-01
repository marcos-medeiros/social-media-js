"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var indexController_1 = __importDefault(require("../controllers/indexController"));
var IndexRouter = /** @class */ (function () {
    function IndexRouter() {
        this.router = express_1.default.Router();
        this.createRoutes();
    }
    IndexRouter.prototype.createRoutes = function () {
        this.router.get("/", indexController_1.default.index);
    };
    return IndexRouter;
}());
exports.default = new IndexRouter().router;

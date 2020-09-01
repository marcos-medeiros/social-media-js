"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var auth_1 = __importDefault(require("../services/auth"));
var postsController_1 = __importDefault(require("../controllers/postsController"));
var IndexRouter = /** @class */ (function () {
    function IndexRouter() {
        this.router = express_1.default.Router();
        this.createRoutes();
    }
    IndexRouter.prototype.createRoutes = function () {
        this.router.get("/", auth_1.default.protectRoute, postsController_1.default.index);
        this.router.post("/new", auth_1.default.protectRoute, postsController_1.default.postValidationChain, postsController_1.default.newPost);
        this.router.post("/:id", auth_1.default.protectRoute, auth_1.default.confirmOwnerPost, this.methodHandler, postsController_1.default.index);
    };
    IndexRouter.prototype.methodHandler = function (req, res, next) {
        if (req.body._method === "DELETE") {
            req.method = "DELETE";
            postsController_1.default.deletePost(req, res, next);
        }
        else if (req.body._method === "PATCH") {
            req.method = "PATCH";
            switch (req.body._query) {
                case "like":
                    postsController_1.default.likePost(req, res, next);
                    break;
                default: next();
            }
        }
        else {
            next();
        }
    };
    return IndexRouter;
}());
exports.default = new IndexRouter().router;

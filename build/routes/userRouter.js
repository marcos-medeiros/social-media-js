"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var passport_1 = __importDefault(require("passport"));
var auth_1 = __importDefault(require("../services/auth"));
var multer_1 = __importDefault(require("../services/multer"));
var userController_1 = __importDefault(require("../controllers/userController"));
var UserRouter = /** @class */ (function () {
    function UserRouter() {
        this.router = express_1.default.Router();
        this.createRoutes();
    }
    UserRouter.prototype.createRoutes = function () {
        this.router.get("/", auth_1.default.protectRoute, userController_1.default.indexGet);
        this.router.post("/login", passport_1.default.authenticate("local", {
            successRedirect: "/user",
            failureRedirect: "/"
        }));
        this.router.get("/logout", function (req, res, next) {
            req.logout();
            res.redirect("/");
        });
        this.router.get("/all", auth_1.default.protectRoute, userController_1.default.allUsersGet);
        this.router.get("/new", userController_1.default.registerGet);
        this.router.post("/new", userController_1.default.userValidationChain, userController_1.default.register);
        this.router.get("/:id", auth_1.default.protectRoute, userController_1.default.profileGet);
        this.router.get("/:id/edit", auth_1.default.protectRoute, auth_1.default.confirmOwnerProfile, userController_1.default.profileGetEdit);
        this.router.post("/:id/edit", auth_1.default.protectRoute, auth_1.default.confirmOwnerProfile, multer_1.default.uploads, userController_1.default.userUpdateValidationChain, userController_1.default.profileUpdate);
        this.router.post("/:id", auth_1.default.protectRoute, this.methodHandler, userController_1.default.indexGet);
        this.router.get("/:id/:page", auth_1.default.protectRoute, userController_1.default.profileGet);
    };
    UserRouter.prototype.methodHandler = function (req, res, next) {
        if (req.body._method === "DELETE") {
            req.method = "DELETE";
            // * What about this route?
            next();
        }
        else if (req.body._method === "PATCH") {
            req.method = "PATCH";
            switch (req.body._query) {
                case "sendFriendRequest":
                    userController_1.default.sendFriendRequest(req, res, next);
                    break;
                case "acceptFriendRequest":
                    userController_1.default.acceptFriendRequest(req, res, next);
                    break;
                case "declineFriendRequest":
                    userController_1.default.declineFriendRequest(req, res, next);
                    break;
                case "cancelFriendRequest":
                    userController_1.default.cancelFriendRequest(req, res, next);
                    break;
                case "unfriend":
                    userController_1.default.unfriend(req, res, next);
                    break;
                default: next();
            }
        }
        else {
            next();
        }
    };
    return UserRouter;
}());
exports.default = new UserRouter().router;

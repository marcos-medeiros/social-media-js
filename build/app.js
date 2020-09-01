"use strict";
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
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var mongoose_1 = __importDefault(require("mongoose"));
var express_session_1 = __importDefault(require("express-session"));
var passport_1 = __importDefault(require("passport"));
var passport_local_1 = __importDefault(require("passport-local"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var indexRouter_1 = __importDefault(require("./routes/indexRouter"));
var userRouter_1 = __importDefault(require("./routes/userRouter"));
var postsRouter_1 = __importDefault(require("./routes/postsRouter"));
var user_1 = __importDefault(require("./models/user"));
var App = /** @class */ (function () {
    function App() {
        this.express = express_1.default();
        this.port = process.env.PORT ? Number(process.env.PORT) : 3000;
        this.setupExpress();
        // Define database
        this.db = this.setupDatabase();
        this.db.on("error", console.error.bind(console, "MongoDB connection error"));
        // Define middleware
        this.setupMiddleware();
        // Define routes
        this.mountRoutes();
        // Define error handler
        this.express.use(this.errorHandler);
    }
    App.prototype.setupExpress = function () {
        this.express.set("views", path_1.default.join(__dirname, "../views"));
        this.express.set("view engine", "pug");
        this.express.set("port", this.port);
    };
    App.prototype.setupDatabase = function () {
        var mongoOpts = { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: true, useCreateIndex: true };
        mongoose_1.default.connect(process.env.MONGODB_URI, mongoOpts);
        return mongoose_1.default.connection;
    };
    App.prototype.defineStrategy = function () {
        var _this = this;
        return new passport_local_1.default.Strategy({ usernameField: "email", passwordField: "password" }, function (email, password, done) { return __awaiter(_this, void 0, void 0, function () {
            var user, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, user_1.default.findOne({ email: email }).exec()];
                    case 1:
                        user = _a.sent();
                        if (!!user) return [3 /*break*/, 2];
                        return [2 /*return*/, done(null, false, { msg: "User not found." })];
                    case 2: return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
                    case 3: return [2 /*return*/, (_a.sent())
                            ? done(null, user)
                            : done(null, false, { msg: "Incorrect password." })];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_1 = _a.sent();
                        return [2 /*return*/, done(err_1)];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
    };
    App.prototype.setupPassport = function () {
        var _this = this;
        passport_1.default.use(this.defineStrategy());
        passport_1.default.serializeUser(function (user, done) {
            done(null, user.id);
        });
        passport_1.default.deserializeUser(function (id, done) { return __awaiter(_this, void 0, void 0, function () {
            var user, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, user_1.default.findById(id).exec()];
                    case 1:
                        user = _a.sent();
                        done(null, user);
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        done(err_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        this.express.use(passport_1.default.initialize());
        this.express.use(passport_1.default.session());
    };
    App.prototype.setupMiddleware = function () {
        this.express.use(express_session_1.default({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
        this.setupPassport();
        this.express.use(express_1.default.urlencoded({ extended: false }));
        this.express.use(cookie_parser_1.default());
        this.express.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
        this.express.use(this.passUserObject);
    };
    App.prototype.mountRoutes = function () {
        this.express.use("/", indexRouter_1.default);
        this.express.use("/user", userRouter_1.default);
        this.express.use("/posts", postsRouter_1.default);
    };
    App.prototype.passUserObject = function (req, res, next) {
        res.locals.currentUser = req.user;
        next();
    };
    App.prototype.errorHandler = function (err, req, res, next) {
        res.locals.message = err.message;
        res.locals.error = err;
        res.status(500).render("error");
    };
    return App;
}());
exports.default = new App().express;

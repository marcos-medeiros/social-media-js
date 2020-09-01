"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * GET / - Homepage
*/
var IndexController = /** @class */ (function () {
    function IndexController() {
    }
    IndexController.index = function (req, res) {
        if (req.user) {
            res.redirect("/user");
        }
        else {
            res.render("index");
        }
    };
    return IndexController;
}());
exports.default = IndexController;

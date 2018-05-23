"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Router = /** @class */ (function () {
    function Router() {
        this.routes = [];
    }
    Router.prototype.matchRoute = function (prefix, isDefaultPage) {
        var _this = this;
        this.routes.push(prefix);
        if (isDefaultPage) {
            this.defaultRoute = prefix;
        }
        return function (location) {
            if (prefix === '/**') {
                return true;
            }
            var route = _this.routes.find(function (r) { return _this.pathMatch(location, r); });
            if (route) {
                return _this.pathMatch(location, prefix);
            }
            else {
                _this.navigate(_this.defaultRoute);
                return false;
            }
        };
    };
    Router.prototype.navigate = function (path) {
        history.pushState(null, null, path);
    };
    Router.prototype.pathMatch = function (location, path) {
        var loc = location.pathname + location.search;
        return loc.indexOf(path) !== -1;
    };
    return Router;
}());
exports.Router = Router;
//# sourceMappingURL=index.js.map
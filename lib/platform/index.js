"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("rxjs/Observable");
window.singleSpaAngularCli = window.singleSpaAngularCli || {};
var Platform = /** @class */ (function () {
    function Platform() {
    }
    Platform.prototype.mount = function (name, router) {
        var _this = this;
        this.name = name;
        this.router = router;
        return Observable_1.Observable.create(function (observer) {
            if (_this.isSingleSpaApp()) {
                window.singleSpaAngularCli[_this.name] = window.singleSpaAngularCli[_this.name] || {};
                window.singleSpaAngularCli[_this.name].mount = function (props) {
                    observer.next({ props: props, attachUnmount: _this.unmount.bind(_this) });
                    observer.complete();
                };
            }
            else {
                observer.next({ props: {}, attachUnmount: _this.unmount.bind(_this) });
                observer.complete();
            }
        });
    };
    Platform.prototype.unmount = function (module) {
        var _this = this;
        if (this.isSingleSpaApp()) {
            window.singleSpaAngularCli[this.name].unmount = function () {
                if (module) {
                    module.destroy();
                    if (_this.router) {
                        module.injector.get(_this.router).dispose();
                    }
                }
            };
        }
    };
    Platform.prototype.isSingleSpaApp = function () {
        return window.singleSpaAngularCli.isSingleSpa;
    };
    return Platform;
}());
exports.Platform = Platform;
//# sourceMappingURL=index.js.map
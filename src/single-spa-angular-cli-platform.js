"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var Observable_1 = require("rxjs/Observable");
var SingleSpaAngularCliPlatform = /** @class */ (function () {
    function SingleSpaAngularCliPlatform() {
    }
    SingleSpaAngularCliPlatform.prototype.mount = function (appName) {
        var _this = this;
        this.appName = appName;
        return Observable_1.Observable.create(function (observer) {
            if (_this.isSingleSpaApp()) {
                window[_this.appName] = {};
                window[_this.appName].mount = function () {
                    observer.next(_this.unmount.bind(_this));
                };
            }
            else {
                observer.next(_this.unmount.bind(_this));
            }
        });
    };
    SingleSpaAngularCliPlatform.prototype.unmount = function (module) {
        if (this.isSingleSpaApp()) {
            window[this.appName].unmount = function () {
                if (module) {
                    module.destroy();
                    try {
                        module.injector.get(router_1.Router).dispose();
                    }
                    catch (err) { }
                }
            };
        }
    };
    SingleSpaAngularCliPlatform.prototype.isSingleSpaApp = function () {
        return document.querySelector('body').hasAttribute('data-single-spa');
    };
    return SingleSpaAngularCliPlatform;
}());
exports.SingleSpaAngularCliPlatform = SingleSpaAngularCliPlatform;
exports.singleSpaAngularCliPlatform = new SingleSpaAngularCliPlatform();
//# sourceMappingURL=single-spa-angular-cli-platform.js.map
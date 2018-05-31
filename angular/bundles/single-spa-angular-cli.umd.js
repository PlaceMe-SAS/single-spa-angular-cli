(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
	typeof define === 'function' && define.amd ? define('single-spa-angular-cli', ['exports', '@angular/core', '@angular/common'], factory) :
	(factory((global['single-spa-angular-cli'] = {}),global.ng.core,global.ng.common));
}(this, (function (exports,core,common) { 'use strict';

var SingleSpaRouterService = /** @class */ (function () {
    function SingleSpaRouterService() {
    }
    SingleSpaRouterService.prototype.navigate = function (path, event) {
        history.pushState(null, null, path);
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
    };
    return SingleSpaRouterService;
}());
SingleSpaRouterService.decorators = [
    { type: core.Injectable },
];
SingleSpaRouterService.ctorParameters = function () { return []; };
var SingleSpaRouterLinkDirective = /** @class */ (function () {
    function SingleSpaRouterLinkDirective(singleSpaRouterService) {
        this.singleSpaRouterService = singleSpaRouterService;
    }
    SingleSpaRouterLinkDirective.prototype.onClick = function ($event) {
        this.singleSpaRouterService.navigate(this.singleSpaRouterLink, $event);
    };
    SingleSpaRouterLinkDirective.prototype.ngOnChanges = function (changes) {
        this.href = this.singleSpaRouterLink;
    };
    return SingleSpaRouterLinkDirective;
}());
SingleSpaRouterLinkDirective.decorators = [
    { type: core.Directive, args: [{
                selector: '[singleSpaRouterLink]'
            },] },
];
SingleSpaRouterLinkDirective.ctorParameters = function () { return [
    { type: SingleSpaRouterService, },
]; };
SingleSpaRouterLinkDirective.propDecorators = {
    "singleSpaRouterLink": [{ type: core.Input },],
    "href": [{ type: core.HostBinding, args: ['href',] },],
    "onClick": [{ type: core.HostListener, args: ['click', ['$event'],] },],
};
var SingleSpaModule = /** @class */ (function () {
    function SingleSpaModule() {
    }
    return SingleSpaModule;
}());
SingleSpaModule.decorators = [
    { type: core.NgModule, args: [{
                imports: [
                    common.CommonModule
                ],
                declarations: [
                    SingleSpaRouterLinkDirective
                ],
                exports: [
                    SingleSpaRouterLinkDirective
                ],
                providers: [
                    SingleSpaRouterService
                ]
            },] },
];

exports.SingleSpaModule = SingleSpaModule;
exports.ɵa = SingleSpaRouterLinkDirective;
exports.ɵb = SingleSpaRouterService;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=single-spa-angular-cli.umd.js.map

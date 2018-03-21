import { Injectable, Directive, HostListener, Input, HostBinding, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    { type: Injectable },
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
    { type: Directive, args: [{
                selector: '[singleSpaRouterLink]'
            },] },
];
SingleSpaRouterLinkDirective.ctorParameters = function () { return [
    { type: SingleSpaRouterService, },
]; };
SingleSpaRouterLinkDirective.propDecorators = {
    "singleSpaRouterLink": [{ type: Input },],
    "href": [{ type: HostBinding, args: ['href',] },],
    "onClick": [{ type: HostListener, args: ['click', ['$event'],] },],
};
var SingleSpaModule = /** @class */ (function () {
    function SingleSpaModule() {
    }
    return SingleSpaModule;
}());
SingleSpaModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
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
SingleSpaModule.ctorParameters = function () { return []; };

export { SingleSpaModule, SingleSpaRouterLinkDirective as ɵa, SingleSpaRouterService as ɵb };
//# sourceMappingURL=single-spa-angular-cli.js.map

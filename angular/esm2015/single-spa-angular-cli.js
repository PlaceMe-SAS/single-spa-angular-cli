import { Injectable, Directive, HostListener, Input, HostBinding, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class SingleSpaRouterService {
    constructor() { }
    /**
     * @param {?} path
     * @param {?=} event
     * @return {?}
     */
    navigate(path, event) {
        history.pushState(null, null, path);
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
    }
}
SingleSpaRouterService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
SingleSpaRouterService.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class SingleSpaRouterLinkDirective {
    /**
     * @param {?} singleSpaRouterService
     */
    constructor(singleSpaRouterService) {
        this.singleSpaRouterService = singleSpaRouterService;
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    onClick($event) {
        this.singleSpaRouterService.navigate(this.singleSpaRouterLink, $event);
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        this.href = this.singleSpaRouterLink;
    }
}
SingleSpaRouterLinkDirective.decorators = [
    { type: Directive, args: [{
                selector: '[singleSpaRouterLink]'
            },] },
];
/** @nocollapse */
SingleSpaRouterLinkDirective.ctorParameters = () => [
    { type: SingleSpaRouterService, },
];
SingleSpaRouterLinkDirective.propDecorators = {
    "singleSpaRouterLink": [{ type: Input },],
    "href": [{ type: HostBinding, args: ['href',] },],
    "onClick": [{ type: HostListener, args: ['click', ['$event'],] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class SingleSpaModule {
}
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { SingleSpaModule, SingleSpaRouterLinkDirective as ɵa, SingleSpaRouterService as ɵb };
//# sourceMappingURL=single-spa-angular-cli.js.map

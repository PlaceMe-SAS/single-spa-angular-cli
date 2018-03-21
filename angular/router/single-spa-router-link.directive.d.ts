import { OnChanges, SimpleChanges } from '@angular/core';
import { SingleSpaRouterService } from './single-spa-router.service';
export declare class SingleSpaRouterLinkDirective implements OnChanges {
    private singleSpaRouterService;
    singleSpaRouterLink: string;
    private href;
    constructor(singleSpaRouterService: SingleSpaRouterService);
    onClick($event: Event): void;
    ngOnChanges(changes: SimpleChanges): void;
}

import { Directive, HostListener, Input, OnChanges, SimpleChanges, HostBinding } from '@angular/core';

import { SingleSpaRouterService } from './single-spa-router.service';

@Directive({
  selector: '[singleSpaRouterLink]'
})
export class SingleSpaRouterLinkDirective implements OnChanges {

  @Input() public singleSpaRouterLink: string;
  @HostBinding('href') private href: string;

  constructor(
    private singleSpaRouterService: SingleSpaRouterService
  ) { }

  @HostListener('click', ['$event']) onClick($event: Event) {
    this.singleSpaRouterService.navigate(this.singleSpaRouterLink, $event);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.href = this.singleSpaRouterLink;
  }

}

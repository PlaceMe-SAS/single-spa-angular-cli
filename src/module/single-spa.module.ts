import { NgModule, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SingleSpaRouterLinkDirective } from './router/single-spa-router-link.directive';
import { SingleSpaRouterService } from './router/single-spa-router.service';

@NgModule({
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
})
export class SingleSpaModule { }

import { Injectable } from '@angular/core';

declare const location: any;
declare const history: any;

@Injectable()
export class SingleSpaRouterService {

  constructor() { }

  navigate(path: string, event?: Event): void {
    history.pushState(null, null, path);
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

}

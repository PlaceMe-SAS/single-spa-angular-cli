import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

declare const window: any;

export class SingleSpaAngularCliPlatform {

    appName: string;
    router: any;

    mount(appName: string, router?: any): Observable<any> {
        this.appName = appName;
        this.router = router;
        return Observable.create((observer: Observer<any>) => {
            if (this.isSingleSpaApp()) {
                window[this.appName] = {};
                window[this.appName].mount = (props: any) => {
                    observer.next({ props, attachUnmount: this.unmount.bind(this) });
                };
            } else {
                observer.next({ props: {}, attachUnmount: this.unmount.bind(this) });
            }
        });
    }

    unmount(module: any) {
        if (this.isSingleSpaApp()) {
            window[this.appName].unmount = () => {
                if (module) {
                    module.destroy();
                    if (this.router) {
                        module.injector.get(this.router).dispose();
                    }
                }
            };
        }
    }

    unload(module: any) {
        if (this.isSingleSpaApp()) {
            window[this.appName].unload = () => {
                if (module) {
                    module.delete();
                    if (this.router) {
                        module.injector.get(this.router).dispose();
                    }
                }
            };
        }
    }

    private isSingleSpaApp(): boolean {
        return document.querySelector('body').hasAttribute('data-single-spa');
    }
}

export const singleSpaAngularCliPlatform = new SingleSpaAngularCliPlatform();
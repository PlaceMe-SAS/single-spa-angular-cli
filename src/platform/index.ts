import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

declare const window: any;
window.singleSpaAngularCli = window.singleSpaAngularCli || {};

export class Platform {

    name: string;
    router: any;

    mount(name: string, router?: any): Observable<any> {
        this.name = name;
        this.router = router;
        return Observable.create((observer: Observer<any>) => {
            if (this.isSingleSpaApp()) {
                window.singleSpaAngularCli[this.name] = window.singleSpaAngularCli[this.name] || {};
                window.singleSpaAngularCli[this.name].mount = (props: any) => {
                    observer.next({ props, attachUnmount: this.unmount.bind(this) });
                    observer.complete();
                };
            } else {
                observer.next({ props: {}, attachUnmount: this.unmount.bind(this) });
                observer.complete();
            }
        });
    }

    unmount(module: any) {
        if (this.isSingleSpaApp()) {
            window.singleSpaAngularCli[this.name].unmount = () => {
                if (module) {
                    module.destroy();
                    if (this.router) {
                        module.injector.get(this.router).dispose();
                    }
                }
            };
        }
    }

    private isSingleSpaApp(): boolean {
        return window.singleSpaAngularCli.isSingleSpa;
    }
}

import { Observable } from 'rxjs/Observable';
export declare class SingleSpaAngularCliPlatform {
    appName: string;
    mount(appName: string): Observable<Function>;
    unmount(module: any): void;
    private isSingleSpaApp();
}
export declare const singleSpaAngularCliPlatform: SingleSpaAngularCliPlatform;

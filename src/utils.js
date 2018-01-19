import { registerApplication } from 'single-spa';

class SingleSpaAngularCliRouter {

    constructor() {
        this.routes = [];
        this.defaultRoute = null;
    }

    hashPrefix(prefix, isDefaultPage) {
        this.routes.push(prefix);
        if(isDefaultPage){
            this.defaultRoute = `#${prefix}`;
        }
        return (location) => {
            if(prefix === '/**') {
                return true;
            }
            const route = this.routes.find(r => location.hash.indexOf(`#${r}`) === 0);
            if (route) {
                return location.hash.indexOf(`#${prefix}`) === 0 || prefix === '/**';
            } else {
                location.assign(this.defaultRoute);
            }
        }
    }

}

export const singleSpaAngularCliRouter = new SingleSpaAngularCliRouter();

export const mainRegisterApplication = (appName, loadingFunction, activityFunction) => {
    registerApplication(appName, loadingFunction, activityFunction);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 100);
    });
};
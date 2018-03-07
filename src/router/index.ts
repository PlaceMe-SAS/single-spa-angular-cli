export class Router {

    routes: any[];
    defaultRoute: string;
    pathStrategy: string;

    constructor() {
        this.routes = [];
        this.defaultRoute = null;
    }

    hashPrefix(prefix: string, isDefaultPage?: boolean): (location: any) => boolean {
        this.routes.push(prefix);
        if (isDefaultPage) {
            this.defaultRoute = prefix;
        }
        return (location: any): boolean => {
            if (prefix === '/**') {
                return true;
            }
            const path = location.pathname;
            const route = this.routes.find(r => path.indexOf(r) === 0);
            if (route) {
                return path.indexOf(`${prefix}`) === 0 || prefix === '/**';
            } else {
                history.pushState(null, null, this.defaultRoute);
                return false;
            }
        }
    }

    hasParameter(parameterName: string, paramaterValue: string = ''): (location: any) => boolean {
        return (location: any) => location.search.indexOf(`?${parameterName}=${paramaterValue}`) !== -1;
    }

}

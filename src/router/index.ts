export class Router {

    routes: any[];
    defaultRoute: string;
    pathStrategy: string;

    constructor() {
        this.routes = [];
        this.defaultRoute = null;
        this.pathStrategy = 'hash';
    }

    setPathStrategy(pathStrategy: string) {
        this.pathStrategy = pathStrategy
    }

    getPath(location: any) {
        return location[this.pathStrategy];
    }

    hashPrefix(prefix: string, isDefaultPage: boolean) {
        this.routes.push(prefix);
        if (isDefaultPage) {
            this.defaultRoute = `#${prefix}`;
        }
        return (location: any) => {
            if (prefix === '/**') {
                return true;
            }
            const path = this.getPath(location);
            const route = this.routes.find(r => path.indexOf(`#${r}`) === 0);
            if (route) {
                return path.indexOf(`#${prefix}`) === 0 || prefix === '/**';
            } else {
                location.assign(this.defaultRoute);
            }
        }
    }

    hasParameter(parameterName: string, paramaterValue: string = '') {
        return (location: any) => {
            const path = this.getPath(location);
            return path.indexOf(`?${parameterName}=${paramaterValue}`) !== -1;
        };
    }

}

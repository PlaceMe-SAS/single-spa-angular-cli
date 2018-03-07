declare const history: History;

export class Router {

    routes: string[];
    defaultRoute: string;

    constructor() {
        this.routes = [];
    }

    hashPrefix(prefix: string, isDefaultPage?: boolean): (location: Location) => boolean {
        this.routes.push(prefix);
        if (isDefaultPage) {
            this.defaultRoute = prefix;
        }
        return (location: Location): boolean => {
            if (prefix === '/**') {
                return true;
            }
            const route = this.routes.find(r => this.pathMatch(location, r));
            if (route) {
                return this.pathMatch(location, prefix);
            } else {
                this.navigate(this.defaultRoute);
                return false;
            }
        }
    }

    hasParameter(key: string, value: string = ''): (location: Location) => boolean {
        return (location: any) => this.parameterMatch(location, key, value);
    }

    public navigate(path: string): void {
        history.pushState(null, null, path);
    }

    private pathMatch(location: Location, path: string): boolean {
        return location.pathname.indexOf(path) === 0;
    }

    private parameterMatch(location: Location, key: string, value: string): boolean {
        return location.search.indexOf(`${key}=${value}`) !== -1;
    }

}

class SingleSpaAngularCliRouter {

    constructor() {
        this.routes = [];
        this.defaultRoute = null;
        this.pathStrategy = 'hash';
    }

    setPathStrategy(pathStrategy) {
        this.pathStrategy = pathStrategy
    }

    getPath(location) {
        return location[this.pathStrategy];
    }

    hashPrefix(prefix, isDefaultPage) {
        this.routes.push(prefix);
        if (isDefaultPage) {
            this.defaultRoute = `#${prefix}`;
        }
        return (location) => {
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

    hasParameter(parameterName, paramaterValue = '') {
        return (location) => {
            const path = this.getPath(location);
            return path.indexOf(`?${parameterName}=${paramaterValue}`) !== -1;
        };
    }

}

export const singleSpaAngularCliRouter = new SingleSpaAngularCliRouter();
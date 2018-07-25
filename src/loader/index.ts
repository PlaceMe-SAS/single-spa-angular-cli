import { Options } from './options.model';

declare const window: any;
window.singleSpaAngularCli = window.singleSpaAngularCli || {};

const xmlToAssets = (xml: string): { styles: string[], scripts: string[] } => {
    const dom = document.createElement('html');
    dom.innerHTML = xml;
    const linksEls = dom.querySelectorAll('link[rel="stylesheet"]');
    const scriptsEls = dom.querySelectorAll('script[type="text/javascript"]');
    return {
        styles: Array.from(linksEls).map(el => el.getAttribute('href')),
        scripts: Array.from(scriptsEls).map(el => el.getAttribute('src')).filter(src => !src.match(/zone\.js/))
    };
};

const transformOptsWithAssets = (opts: Options): Promise<null> => {
    const url = `${opts.baseHref}/index.html`;
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.onreadystatechange = (event) => {
            if (req.readyState === XMLHttpRequest.DONE) {
                if (req.status >= 200 && req.status < 400) {
                    const res = xmlToAssets(req.responseText);
                    opts.styles = res.styles;
                    opts.scripts = res.scripts;
                    resolve(null);
                } else {
                    reject(`Try to load ${url}, status : ${this.status} => ${this.statusText}`);
                }
            }
        };
        req.open('GET', url, true);
        req.send(null);
    });
};

const getContainerEl = (opts: Options) => {
    let el = document.querySelector(opts.selector);
    if (!el) {
        el = document.createElement(opts.selector);
        let container = opts.container ? document.querySelector(opts.container) : document.body;
        container.appendChild(el);
    }
    return el;
};

const noLoadingApp = (currentApp: string, singleSpa: any) => {
    const { getAppNames, getAppStatus, BOOTSTRAPPING } = singleSpa
    const firstInMounting = getAppNames().find((appName: string) => {
        return getAppStatus(appName) === BOOTSTRAPPING;
    });
    const firstInMountingIndex = getAppNames().indexOf(firstInMounting);
    const currentIndex = getAppNames().indexOf(currentApp);
    return currentIndex <= firstInMountingIndex;
};

const onNotLoadingApp = (currentApp: string, props: any) => {
    const { singleSpa } = props;
    return new Promise((resolve, reject) => {
        let time = 0;
        const INTERVAL = 100;
        const interval = setInterval(() => {
            time += INTERVAL;
            if (noLoadingApp(currentApp, singleSpa)) {
                clearInterval(interval);
                resolve();
            }
            if (time >= (props.customProps.bootstrapMaxTime || 3000)) {
                clearInterval(interval);
                reject(`The application could not be loaded because another is still loading more than ${time} milliseconds`);
            }
        }, INTERVAL);
    });
};

const loadAllAssets = (opts: Options) => {
    return new Promise((resolve, reject) => {
        transformOptsWithAssets(opts).then(() => {
            const scriptsPromise = opts.scripts.reduce(
                (prev: Promise<undefined>, fileName: string) => prev.then(loadScriptTag(`${opts.baseHref}/${fileName}`)),
                Promise.resolve(undefined)
            );
            const stylesPromise = opts.styles.reduce(
                (prev: Promise<undefined>, fileName: string) => prev.then(loadLinkTag(`${opts.baseHref}/${fileName}`)),
                Promise.resolve(undefined)
            );
            Promise.all([scriptsPromise, stylesPromise]).then(resolve, reject);
        }, reject);
    });
};

const hashCode = (str: string): string => {
    let hash = 0;
    if (str.length === 0) return hash.toString();
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash = hash & hash;
        hash = hash >>> 1;
    }
    return hash.toString();
};

const loadScriptTag = (url: string) => {
    return () => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.onload = function () {
                resolve();
            };
            script.onerror = err => {
                reject(err);
            };
            script.src = url;
            script.id = hashCode(url);
            document.head.appendChild(script);
        });
    };
};

const loadLinkTag = (url: string) => {
    return () => {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.onload = function () {
                resolve();
            };
            link.onerror = err => {
                reject(err);
            };
            link.href = url;
            link.rel = 'stylesheet';
            link.id = hashCode(url);
            document.head.appendChild(link);
        });
    };
};

const unloadTag = (url: string) => {
    return () => {
        return new Promise((resolve, reject) => {
            const tag = document.getElementById(hashCode(url));
            document.head.removeChild(tag);
            resolve();
        });
    };
};

const bootstrap = (opts: Options, props: any) => {
    window.singleSpaAngularCli.isSingleSpa = true;
    return new Promise((resolve, reject) => {
        onNotLoadingApp(opts.name, props).then(() => {
            loadAllAssets(opts).then(resolve, reject);
        }, reject);
    });
};

const mount = (opts: Options, props: any) => {
    return new Promise((resolve, reject) => {
        getContainerEl(opts);
        if (window.singleSpaAngularCli[opts.name]) {
            window.singleSpaAngularCli[opts.name].mount(props);
            resolve();
        } else {
            console.error(`Cannot mount ${opts.name} because that is not bootstraped`);
            reject();
        }
    });
};

const unmount = (opts: Options, props: any) => {
    const { singleSpa: { unloadApplication, getAppNames } } = props;
    return new Promise((resolve, reject) => {
        if (window.singleSpaAngularCli[opts.name]) {
            window.singleSpaAngularCli[opts.name].unmount();
            getContainerEl(opts).remove();
            if (getAppNames().indexOf(opts.name) !== -1) {
                unloadApplication(opts.name, { waitForUnmount: true });
                resolve();
            } else {
                reject(`Cannot unmount ${opts.name} because that ${opts.name} is not part of the decalred applications : ${getAppNames()}`);
            }
        } else {
            reject(`Cannot unmount ${opts.name} because that is not bootstraped`);
        }
    });
};

const unload = (opts: Options, props: any) => {
    return new Promise((resolve, reject) => {
        opts.scripts.concat(opts.styles).reduce(
            (prev: Promise<undefined>, scriptName: string) => prev.then(unloadTag(`${opts.baseHref}/${scriptName}`)),
            Promise.resolve(undefined)
        );
        resolve();
    });
};

export function loader(opts: Options) {
    if (typeof opts !== 'object') {
        throw new Error(`single-spa-angular-cli requires a configuration object`);
    }

    if (typeof opts.name !== 'string') {
        throw new Error(`single-spa-angular-cli must be passed opts.name string (ex : app1)`);
    }

    if (typeof opts.baseHref !== 'string') {
        throw new Error(`single-spa-angular-cli must be passed opts.baseHref string (ex : /app1)`);
    }

    return {
        bootstrap: bootstrap.bind(null, opts),
        mount: mount.bind(null, opts),
        unmount: unmount.bind(null, opts),
        unload: unload.bind(null, opts)
    };
}

"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
window.singleSpaAngularCli = window.singleSpaAngularCli || {};
var xmlToAssets = function (xml) {
    var dom = document.createElement('html');
    dom.innerHTML = xml;
    var linksEls = dom.querySelectorAll('link[rel="stylesheet"]');
    var scriptsEls = dom.querySelectorAll('script[type="text/javascript"]');
    return {
        styles: Array.from(linksEls).map(function (el) { return el.getAttribute('href'); }).filter(function (src) { return !src.match(/fonts\.css/); }),
        scripts: Array.from(scriptsEls).map(function (el) { return el.getAttribute('src'); }).filter(function (src) { return !src.match(/zone\.js/); })
    };
};
var transformOptsWithAssets = function (opts) {
    var url = opts.baseHref + "/index.html";
    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function (event) {
            if (req.readyState === XMLHttpRequest.DONE) {
                if (req.status >= 200 && req.status < 400) {
                    var res = xmlToAssets(req.responseText);
                    opts.styles = res.styles;
                    opts.scripts = res.scripts;
                    resolve(null);
                }
                else {
                    reject("Try to load " + url + ", status : " + _this.status + " => " + _this.statusText);
                }
            }
        };
        req.open('GET', url, true);
        req.send(null);
    });
};
var getContainerEl = function (opts) {
    var el = document.querySelector(opts.selector);
    if (!el) {
        el = document.createElement(opts.selector);
        document.body.appendChild(el);
    }
    return el;
};
var noLoadingApp = function (currentApp, singleSpa) {
    var getAppNames = singleSpa.getAppNames, getAppStatus = singleSpa.getAppStatus, BOOTSTRAPPING = singleSpa.BOOTSTRAPPING;
    var firstInMounting = getAppNames().find(function (appName) {
        return getAppStatus(appName) === BOOTSTRAPPING;
    });
    var firstInMountingIndex = getAppNames().indexOf(firstInMounting);
    var currentIndex = getAppNames().indexOf(currentApp);
    return currentIndex <= firstInMountingIndex;
};
var onNotLoadingApp = function (currentApp, singleSpa) {
    return new Promise(function (resolve, reject) {
        var time = 0;
        var INTERVAL = 100;
        var interval = setInterval(function () {
            time += INTERVAL;
            if (noLoadingApp(currentApp, singleSpa)) {
                clearInterval(interval);
                resolve();
            }
            if (time >= 3000) {
                clearInterval(interval);
                reject("The application could not be loaded because another is still loading more than " + time + " milliseconds");
            }
        }, INTERVAL);
    });
};
var loadAllAssets = function (opts) {
    return new Promise(function (resolve, reject) {
        transformOptsWithAssets(opts).then(function () {
            var scriptsPromise = opts.scripts.reduce(function (prev, fileName) { return prev.then(loadScriptTag(opts.baseHref + "/" + fileName)); }, Promise.resolve(undefined));
            var stylesPromise = opts.styles.reduce(function (prev, fileName) { return prev.then(loadLinkTag(opts.baseHref + "/" + fileName)); }, Promise.resolve(undefined));
            Promise.all([scriptsPromise, stylesPromise]).then(resolve, reject);
        }, reject);
    });
};
var hashCode = function (str) {
    var hash = 0;
    if (str.length == 0)
        return hash.toString();
    for (var i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash = hash & hash;
        hash = hash >>> 1;
    }
    return hash.toString();
};
var loadScriptTag = function (url) {
    return function () {
        return new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            script.onload = function () {
                resolve();
            };
            script.onerror = function (err) {
                reject(err);
            };
            script.src = url;
            script.id = hashCode(url);
            document.head.appendChild(script);
        });
    };
};
var loadLinkTag = function (url) {
    return function () {
        return new Promise(function (resolve, reject) {
            var link = document.createElement('link');
            link.onload = function () {
                resolve();
            };
            link.onerror = function (err) {
                reject(err);
            };
            link.href = url;
            link.rel = 'stylesheet';
            link.id = hashCode(url);
            document.head.appendChild(link);
        });
    };
};
var unloadTag = function (url) {
    return function () {
        return new Promise(function (resolve, reject) {
            var tag = document.getElementById(hashCode(url));
            document.head.removeChild(tag);
            resolve();
        });
    };
};
var bootstrap = function (opts, props) {
    window.singleSpaAngularCli.isSingleSpa = true;
    var singleSpa = props.singleSpa;
    return new Promise(function (resolve, reject) {
        onNotLoadingApp(opts.name, singleSpa).then(function () {
            loadAllAssets(opts).then(resolve, reject);
        }, reject);
    });
};
var mount = function (opts, props) {
    return new Promise(function (resolve, reject) {
        getContainerEl(opts);
        if (window.singleSpaAngularCli[opts.name]) {
            window.singleSpaAngularCli[opts.name].mount(props);
            resolve();
        }
        else {
            console.error("Cannot mount " + opts.name + " because that is not bootstraped");
            reject();
        }
    });
};
var unmount = function (opts, props) {
    var _a = props.singleSpa, unloadApplication = _a.unloadApplication, getAppNames = _a.getAppNames;
    return new Promise(function (resolve, reject) {
        if (window.singleSpaAngularCli[opts.name]) {
            window.singleSpaAngularCli[opts.name].unmount();
            getContainerEl(opts).remove();
            if (getAppNames().indexOf(opts.name) !== -1) {
                unloadApplication(opts.name, { waitForUnmount: true });
                resolve();
            }
            else {
                reject("Cannot unmount " + opts.name + " because that " + opts.name + " is not part of the decalred applications : " + getAppNames());
            }
        }
        else {
            reject("Cannot unmount " + opts.name + " because that is not bootstraped");
        }
    });
};
var unload = function (opts, props) {
    return new Promise(function (resolve, reject) {
        opts.scripts.concat(opts.styles).reduce(function (prev, scriptName) { return prev.then(unloadTag(opts.baseHref + "/" + scriptName)); }, Promise.resolve(undefined));
        resolve();
    });
};
function loader(opts) {
    if (typeof opts !== 'object') {
        throw new Error("single-spa-angular-cli requires a configuration object");
    }
    if (typeof opts.name !== 'string') {
        throw new Error("single-spa-angular-cli must be passed opts.name string (ex : app1)");
    }
    if (typeof opts.baseHref !== 'string') {
        throw new Error("single-spa-angular-cli must be passed opts.baseHref string (ex : /app1)");
    }
    return {
        bootstrap: bootstrap.bind(null, opts),
        mount: mount.bind(null, opts),
        unmount: unmount.bind(null, opts),
        unload: unload.bind(null, opts)
    };
}
exports.loader = loader;
//# sourceMappingURL=index.js.map
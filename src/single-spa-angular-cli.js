const defaultOpts = {
  // required opts
  name: null,
  selector: null,
  baseScriptUrl: null,
  styles: [],
  scripts: []
};

const getContainerEl = (opts) => {
  let el = document.querySelector(opts.selector);
  if (!el) {
    el = document.createElement(opts.selector);
    document.body.appendChild(el);
  }
  return el;
};

const noLoadingApp = (currentApp, singleSpa) => {
  const {getAppNames, getAppStatus, BOOTSTRAPPING} = singleSpa
  const firstInMounting = getAppNames().find((appName) => {
    return getAppStatus(appName) === BOOTSTRAPPING;
  });
  const firstInMountingIndex = getAppNames().indexOf(firstInMounting);
  const currentIndex = getAppNames().indexOf(currentApp);
  return currentIndex <= firstInMountingIndex;
};

const onNotLoadingApp = (currentApp, singleSpa) => {
  return new Promise((resolve, reject) => {
    let time = 0;
    const INTERVAL = 100;
    const interval = setInterval(() => {
      time += INTERVAL;
      if (noLoadingApp(currentApp, singleSpa)) {
        clearInterval(interval);
        resolve();
      }
      if (time >= 3000) {
        clearInterval(interval);
        reject(`The application could not be loaded because another is still loading more than ${time} milliseconds`);
      }
    }, INTERVAL);
  });
};

const loadAllAssets = (opts) => {
  const domEl = getContainerEl(opts);
  const scriptsPromise = opts.scripts.reduce(
    (prev, fileName) => prev.then(loadScriptTag(`${opts.baseScriptUrl}/${fileName}`, domEl)),
    Promise.resolve()
  );
  const stylesPromise = opts.styles.reduce(
    (prev, fileName) => prev.then(loadLinkTag(`${opts.baseScriptUrl}/${fileName}`, domEl)),
    Promise.resolve()
  )
  return Promise.all([scriptsPromise, stylesPromise]);
};

const hashCode = (str) => {
  var hash = 0;
  if (str.length == 0) return hash;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash;
    hash = hash >>> 1;
  }
  return hash;
};

const loadScriptTag = (url, domEl) => {
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

const loadLinkTag = (url, domEl) => {
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

const unloadTag = (url) => {
  return () => {
    return new Promise((resolve, reject) => {
      const tag = document.getElementById(hashCode(url));
      document.head.removeChild(tag);
      resolve();
    });
  };
};

const bootstrap = (opts, props) => {
  const {singleSpa} = props
  return new Promise((resolve, reject) => {
    onNotLoadingApp(opts.name, singleSpa).then(() => {
      loadAllAssets(opts).then(resolve, reject);
    }, reject);
  });
};

const mount = (opts, props) => {
  return new Promise((resolve, reject) => {
    const domEl = getContainerEl(opts);
    const angularRootEl = document.createElement(opts.selector);
    domEl.appendChild(angularRootEl);
    if (window[opts.selector]) {
      window[opts.selector].mount();
      resolve();
    } else {
      console.error(`Cannot mount ${opts.name} because that is not bootstraped`);
      reject();
    }
  });
};

const unmount = (opts, props) => {
  const {singleSpa: {unloadApplication, getAppNames}} = props
  return new Promise((resolve, reject) => {
    if (window[opts.selector]) {
      window[opts.selector].unmount();
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

const unload = (opts, props) => {
  return new Promise((resolve, reject) => {
    opts.scripts.concat(opts.styles).reduce(
      (prev, scriptName) => prev.then(unloadTag(`${opts.baseScriptUrl}/${scriptName}`)),
      Promise.resolve()
    );
    resolve();
  });
};

export default function singleSpaAngularCli(userOpts) {
  if (typeof userOpts !== 'object') {
    throw new Error(`single-spa-angular-cli requires a configuration object`);
  }

  const opts = {
    ...defaultOpts,
    ...userOpts
  };

  if (typeof opts.name !== 'string') {
    throw new Error(`single-spa-angular-cli must be passed opts.name string`);
  }

  if (typeof opts.selector !== 'string') {
    throw new Error(`single-spa-angular-cli must be passed opts.selector string`);
  }

  if (typeof opts.baseScriptUrl !== 'string') {
    throw new Error(`single-spa-angular-cli must be passed opts.baseScriptUrl string`);
  }

  if (typeof opts.styles !== 'object') {
    throw new Error(`single-spa-angular-cli must be passed opts.style array of strings empty or not`);
  }

  if (opts.scripts.length < 0) {
    throw new Error(`single-spa-angular-cli must be passed opts.scripts array not empty`);
  }

  return {
    bootstrap: bootstrap.bind(null, opts),
    mount: mount.bind(null, opts),
    unmount: unmount.bind(null, opts),
    unload: unload.bind(null, opts)
  };
}

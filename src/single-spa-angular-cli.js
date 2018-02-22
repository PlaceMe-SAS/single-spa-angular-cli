import { unloadApplication } from 'single-spa';

const defaultOpts = {
  // required opts
  selector: null,
  baseScriptUrl: null,
  scripts: []
};

export default function singleSpaAngularCli(userOpts) {
  if (typeof userOpts !== 'object') {
    throw new Error(`single-spa-angular-mf requires a configuration object`);
  }

  const opts = {
    ...defaultOpts,
    ...userOpts
  };

  if (typeof opts.selector !== 'string') {
    throw new Error(`single-spa-angular-mf must be passed opts.selector string`);
  }

  if (typeof opts.baseScriptUrl !== 'string') {
    throw new Error(`single-spa-angular-mf must be passed opts.baseScriptUrl string`);
  }

  if (typeof opts.scripts.length > 0) {
    throw new Error(`single-spa-angular-mf must be passed opts.scripts array not empty`);
  }

  return {
    bootstrap: bootstrap.bind(null, opts),
    mount: mount.bind(null, opts),
    unmount: unmount.bind(null, opts),
    unload: unload.bind(null, opts)
  };
}

function bootstrap(opts) {
  const domEl = getContainerEl(opts);
  return opts.scripts.reduce(
    (prev, scriptName) => prev.then(loadTag(`${opts.baseScriptUrl}/${scriptName}`, domEl)),
    Promise.resolve()
  );
}

function mount(opts) {
  return new Promise((resolve, reject) => {
    const domEl = getContainerEl(opts);
    const angularRootEl = document.createElement(opts.selector);
    domEl.appendChild(angularRootEl);
    if (window[opts.selector]) {
      window[opts.selector].mount();
      resolve();
    } else {
      console.error(`Cannot mount ${opts.selector} because that is not bootstraped`);
      reject();
    }
  });
}

function unmount(opts) {
  return new Promise((resolve, reject) => {
    if (window[opts.selector]) {
      window[opts.selector].unmount();
      getContainerEl(opts).innerHTML = '';
      unloadApplication(opts.name, { waitForUnmount: true });
      resolve();
    } else {
      reject(`Cannot unmount ${opts.selector} because that is not bootstraped`);
    }
  });
}

function unload(opts) {
  return new Promise((resolve, reject) => {
    opts.scripts.reduce(
      (prev, scriptName) => prev.then(unloadTag(`${opts.baseScriptUrl}/${scriptName}`)),
      Promise.resolve()
    );
    resolve();
  });
}

function getContainerEl(opts) {
  let el = document.querySelector(opts.selector);
  if (!el) {
    el = document.createElement(opts.selector);
    document.body.appendChild(el);
  }
  return el;
}

async function runPromisesInSequence(promises) {
  for (let promise of promises) {
    await promise();
  }
}

function loadTag(url, domEl) {
  const urlParts = url.split('.');
  if (urlParts[urlParts.length - 1] === 'css') {
    return loadLinkTag(url, domEl);
  } else {
    return loadScriptTag(url, domEl);
  }
}

function loadScriptTag(url, domEl) {
  return () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.onload = function() {
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
}

function loadLinkTag(url, domEl) {
  return () => {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.onload = function() {
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
}

function unloadTag(url) {
  return () => {
    return new Promise((resolve, reject) => {
      const tag = document.getElementById(hashCode(url));
      document.head.removeChild(tag);
      resolve();
    });
  };
}

function hashCode(str) {
  var hash = 0;
  if (str.length == 0) return hash;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash;
    hash = hash >>> 1;
  }
  return hash;
}

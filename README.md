# single-spa-angular-cli
Helpers for building [single-spa](https://github.com/CanopyTax/single-spa) applications which use Angular Cli.

## Example
An example can be found in the [single-spa-examples](https://github.com/PlaceMe-SAS/single-spa-angular-cli-examples) repository.

## Quickstart
First, in the child application, run `npm install --save single-spa-angular-cli` (or `jspm install npm:single-spa-angular-cli` if your child application is managed by jspm). Then, in your [child app's entry file](https://github.com/CanopyTax/single-spa/blob/docs-1/docs/configuring-child-applications.md#the-entry-file), do the following:

```js
// src/loaders/app1.js

import singleSpaAngularCli from 'single-spa-angular-cli';

const lifecycles = singleSpaAngularCli({
    name: 'app1',
    selector: 'app1-root',
    baseScriptUrl: '/src/apps/app1/dist',
    styles: [
        'styles.bundle.css',
    ],
    scripts: [
        'inline.bundle.js',
        'polyfills.bundle.js',
        'main.bundle.js'
    ]
});

export const bootstrap = [
    lifecycles.bootstrap
];

export const mount = [
    lifecycles.mount
];

export const unmount = [
    lifecycles.unmount
];

export const unload = [
    lifecycles.unload
];
```

## Options

All options are passed to single-spa-angular2 via the `opts` parameter when calling `singleSpaAngularCli(opts)`. The following options are available:

- `selector`: (required) The angular application root tag, ex : app-root.
- `baseScriptUrl`: This is your angular cli server url (or production server when script will be present), ex : http://localhost:4200.
- `styles`: (required) All your application builded styles, ex : 
```js
[
    'style.bundle.js'
]
- `scripts`: (required) All your application builded scripts, ex : 
```js
[
    'inline.bundle.js',
    'polyfills.bundle.js',
    'styles.bundle.js',
    'main.bundle.js',
    // And all your lazy loaded module generated
]
```
## Full documentation here
An example can be found in the [single-spa-examples](https://github.com/PlaceMe-SAS/single-spa-angular-cli-examples) repository.
# single-spa-angular-cli
Helpers for building [single-spa](https://github.com/CanopyTax/single-spa) applications which use Angular Cli.

## Example
An example can be found in the [single-spa-angular-cli-examples](https://github.com/PlaceMe-SAS/single-spa-angular-cli-examples) repository.

## Quickstart
First, in the child application, run `npm install --save single-spa-angular-cli`. Then, in your [single-spa application](https://github.com/CanopyTax/single-spa/blob/master/docs/applications.md), do the following:

```js
// loader.js

import { loader } from 'single-spa-angular-cli';

const lifecycles = loader({
    name: 'app1',
    selector: 'app1-root',
    baseHref: '/app1'
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

- `name`: (required) The name of the single spa application, ex : app.
- `selector`: (required) The angular application root tag, ex : app-root.
- `container`: (optional) The html container selector, ex : ".container" or "#container".
- `baseHref`: (required) The base href of your angular cli app, ex : /app.

## Full documentation here
An example can be found in the [single-spa-angular-cli-examples](https://github.com/PlaceMe-SAS/single-spa-angular-cli-examples) repository.

# single-spa-angular-cli
Helpers for building [single-spa](https://github.com/CanopyTax/single-spa) applications which use Angular 2.

## Example
An example can be found in the [single-spa-examples](https://github.com/CanopyTax/single-spa-examples/blob/master/src/angular-cli/angular-cli.app.js) repository.

## Quickstart
First, in the child application, run `npm install --save single-spa-angular-cli` (or `jspm install npm:single-spa-angular-cli` if your child application is managed by jspm). Then, in your [child app's entry file](https://github.com/CanopyTax/single-spa/blob/docs-1/docs/configuring-child-applications.md#the-entry-file), do the following:

```js
// src/app1/loader.js

import singleSpaAngularCli from 'single-spa-angular-cli';

const lifecycles = singleSpaAngularCli({
    selector: 'app1-root',
    baseScriptUrl: 'http://localhost:4202',
    scripts: [
        'inline.bundle.js',
        'polyfills.bundle.js',
        'styles.bundle.js',
        'vendor.bundle.js',
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
```

## Options

All options are passed to single-spa-angular2 via the `opts` parameter when calling `singleSpaAngular2(opts)`. The following options are available:

- `selector`: (required) The angular application root tag, ex : app-root.
- `baseScriptUrl`: This is your angular cli server url (or production server when script will be present), ex : http://localhost:4200.
- `scripts`: (required) All your application builded scripts, ex : scripts: ['inline.bundle.js', 'polyfills.bundle.js', 'styles.bundle.js', 'vendor.bundle.js', 'main.bundle.js']

## This project is an Angular 5 portal as microfrontend lazy loaded thanks to the CLI

## How to get the examples running locally
```bash
git clone git@github.com:PlaceMe-SAS/single-spa-examples.git
cd single-spa-examples
npm install
npm run start
open http://localhost:8080
```

### Serve your angular project
```bash
npm install -g @angular/cli
cd src/menu
npm install
ng serve --port=4200
```
open http://localhost:4200

```bash
npm install -g @angular/cli
cd src/home
npm install
ng serve
```
open http://localhost:4201

### For production apps mode
```bash
ng build --prod
```
And replace the target url of your child app

repeat for all angular cli projects

## Add an angular cli apps
```bash
cd src
ng new app1 --prefix=app1
cd app1
ng serve --port=4202
```
open http://localhost:4202

```js
// src/app1/loader.js

import singleSpaAngularCli from 'single-spa-angular-cli';

const lifecycles = singleSpaAngularCli({
    selector: 'app1-root',
    baseScriptUrl: '/apps/app1',
    scripts: [
        'inline.bundle.js',
        'polyfills.bundle.js',
        'styles.bundle.js',
        'vendor.bundle.js',
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

```

```js
// src/app1/src/polyfills.ts

// Comment zone.js, it is globaly imported by the portal
// import 'zone.js/dist/zone';  // Included with Angular CLI.
```

```html
// src/app1/src/index.html

  <app1-root></app1-root>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/zone.js/0.8.19/zone.js"></script>
</body>
```

```js
// src/main.js

mainRegisterApplication('menu', () => import('./menu/loader.js'), singleSpaAngularCliRouter.hashPrefix('/**')).then(() => {
    registerApplication('home', () => import('./home/loader.js'), singleSpaAngularCliRouter.hashPrefix('/home', true));
    registerApplication('app1', () => import('./app1/loader.js'), singleSpaAngularCliRouter.hashPrefix('/app1'));
});
start();
```

```js
// src/app1/src/main.ts

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { singleSpaAngularCliPlatform } from 'single-spa-angular-cli/src/single-spa-angular-cli-platform';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

singleSpaAngularCliPlatform.mount('app1-root').subscribe((attachUnmount) => {
  platformBrowserDynamic().bootstrapModule(AppModule).then(attachUnmount);
});
```
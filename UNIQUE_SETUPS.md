# Unique Setup Steps for Xahau.js

Starting in 3.0 xahau and all the packages in this repo no longer require custom configurations (ex. polyfills) to run.

### Using xahau.js from a CDN

You can avoid setting up your build system to handle `xahau.js` by using a cdn version that is prebuilt for the browser.

- unpkg `<script src="https://unpkg.com/xahau@2.3.0/build/xahau-latest-min.js"></script>`
- jsdelivr `<script src="https://cdn.jsdelivr.net/npm/xahau@2.3.0/build/xahau-latest-min.js"></script>`

Ensure that the full path is provided so the browser can find the sourcemaps.

### Using xahau.js with `create-react-app`

Starting in 3.0 xahau and its related packages no longer require custom configurations (ex. polyfills) to run.

This online template uses these steps to run xahau.js with React in the browser:
https://codesandbox.io/s/xahau-intro-pxgdjr?file=/src/App.js

### Using xahau.js with React Native

If you want to use `xahau.js` with React Native you will need to install polyfills for core NodeJS modules.

1. Install dependencies (you can use `yarn` as well):

   ```shell
   npm install xahau \
       fast-text-encoding \
       react-native-get-random-values
   ```

2. After that, run the following commands:

   ```shell
   # compile `react-native-get-random-values` pods see https://www.npmjs.com/package/react-native-get-random-values#installation
   npx pod-install
   ```

3. Create `polyfills.js` and add

```javascript
// Required for TextEncoder/TextDecoder
import 'fast-text-encoding'
// Required for `crypto.getRandomValues`
import 'react-native-get-random-values'
```

4. Import `polyfills` in index file your project (it must be the first line):

```javascript
import './polyfills'
...
```

### Using xahau.js with Vite React

Starting in 3.0 xahau and all the packages in this repo no longer require custom configurations (ex. polyfills) to run.

### Using xahau.js with Deno

Until official support for [Deno](https://deno.land) is added, you can use the following work-around to use `xahau.js` with Deno:

> [!NOTE]
> The following is currently broken due to https://github.com/denoland/deno/issues/20516.
> Once that is fixed there could be other issues as well.

```javascript
import xahau from 'https://dev.jspm.io/npm:xahau';

(async () => {
  const api = new (xahau as any).Client('wss://xahau-test.net');
  const address = 'rH8NxV12EuV...khfJ5uw9kT';

  api.connect().then(() => {
    api.getBalances(address).then((balances: any) => {
      console.log(JSON.stringify(balances, null, 2));
    });
  });
})();
```

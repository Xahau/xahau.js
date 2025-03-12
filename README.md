# xahau.js

A JavaScript/TypeScript library for interacting with the Xahau Ledger

[![NPM](https://nodei.co/npm/xahau.png)](https://www.npmjs.org/package/xrpl)
![npm bundle size](https://img.shields.io/bundlephobia/min/xrpl)

This is the recommended library for integrating a JavaScript/TypeScript app with the Xahau Ledger, especially if you intend to use advanced functionality such as IOUs, payment paths, the decentralized exchange, account settings, payment channels, escrows, multi-signing, and more.

## [➡️ Reference Documentation](http://js.xahau.org)

See the full reference documentation for all classes, methods, and utilities.

## Features

1. Managing keys & creating test credentials ([`Wallet`](https://js.xahau.org/classes/Wallet.html) && [`Client.fundWallet()`](https://js.xahau.org/classes/Client.html#fundWallet))
2. Submitting transactions to the Xahau Ledger ([`Client.submit(...)`](https://js.xahau.org/classes/Client.html#submit) & [transaction types](https://xahau.org/transaction-types.html))
3. Sending requests to observe the ledger ([`Client.request(...)`](https://js.xahau.org/classes/Client.html#request) using [public API methods](https://xahau.org/public-api-methods.html))
4. Subscribing to changes in the ledger ([Ex. ledger, transactions, & more...](https://xahau.org/subscribe.html))
5. Parsing ledger data into more convenient formats ([`xrpToDrops`](https://js.xahau.org/functions/xrpToDrops.html) and [`rippleTimeToISOTime`](https://js.xahau.org/functions/rippleTimeToISOTime.html))

All of which works in Node.js (tested for v18+) & web browsers (tested for Chrome).

# Quickstart

### Requirements

+ **[Node.js v18](https://nodejs.org/)** is recommended. We also support v20. Other versions may work but are not frequently tested.

### Installing xahau.js

In an existing project (with package.json), install xahau.js with:

```
$ npm install --save xrpl
```

Or with `yarn`:

```
$ yarn add xrpl
```

Example usage:

```js
const xrpl = require("xrpl");
async function main() {
  const client = new xahau.Client("wss://s.altnet.rippletest.net:51233");
  await client.connect();

  const response = await client.request({
    command: "account_info",
    account: "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
    ledger_index: "validated",
  });
  console.log(response);

  await client.disconnect();
}
main();
```

For a more in-depth example, you can copy/forking this Code Sandbox template!
<br>https://codesandbox.io/s/xrpl-intro-pxgdjr?file=/src/App.js

It goes through:

1. Creating a new test account
2. Sending a payment transaction
3. And sending requests to see your account balance!

### Case by Case Setup Steps

If you're using xahau.js with React or Deno, you'll need to do a couple extra steps to set it up:

- [Using xahau.js with a CDN](https://github.com/XRPLF/xahau.js/blob/main/UNIQUE_SETUPS.md#using-xrpljs-from-a-cdn)
- [Using xahau.js with `create-react-app`](https://github.com/XRPLF/xahau.js/blob/main/UNIQUE_SETUPS.md#using-xrpljs-with-create-react-app)
- [Using xahau.js with `React Native`](https://github.com/XRPLF/xahau.js/blob/main/UNIQUE_SETUPS.md#using-xrpljs-with-react-native)
- [Using xahau.js with `Vite React`](https://github.com/XRPLF/xahau.js/blob/main/UNIQUE_SETUPS.md#using-xrpljs-with-vite-react)
- [Using xahau.js with `Deno`](https://github.com/XRPLF/xahau.js/blob/main/UNIQUE_SETUPS.md#using-xrpljs-with-deno)

## Documentation

As you develop with xahau.js, there's two sites you'll use extensively:

1. [xahau.org](https://xahau.org/references.html) is the primary source for:
   - How the ledger works ([See Concepts](https://xahau.org/concepts.html#main-page-header))
   - What kinds of transactions there are ([Transaction Types](https://xahau.org/transaction-types.html#transaction-types))
   - Requests you can send ([Public API Methods](https://xahau.org/public-api-methods.html))
   - Tutorials for interacting with various features of the ledger ([Tutorials](https://xahau.org/tutorials.html#main-page-header))
2. [js.xahau.org](https://js.xahau.org/) has the reference docs for this library

### Mailing Lists

If you want to hear when we release new versions of xahau.js, you can join our low-traffic mailing list (About 1 email per week):

- [Subscribe to xahau-announce](https://groups.google.com/g/xahau-announce)

If you're using the Xahau Ledger in production, you should run a [rippled server](https://github.com/ripple/rippled) and subscribe to the ripple-server mailing list as well.

- [Subscribe to ripple-server](https://groups.google.com/g/ripple-server)

## Asking for help

One of the best spots to ask for help is in the [XRPL Developer Discord](https://xrpldevs.org) - There's a channel for xahau.js where other community members can help you figure out how to accomplish your goals.

You are also welcome to create an [issue](https://github.com/XRPLF/xahau.js/issues) here and we'll do our best to respond within 3 days.

## Key Links

- [xahau.js Reference Docs](https://js.xahau.org/)
- [xahau.org (Detailed docs on how the XRPL works)](https://xahau.org/references.html)
- [XRPL Code Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples)
- [#javascript in the XRPL Developer Discord for questions & support](https://xrpldevs.org)
- [xahau-announce (The mailing list for new xahau.js versions)](https://groups.google.com/g/xahau-announce)
- [Applications that use xahau.js](https://github.com/XRPLF/xahau.js/blob/main/APPLICATIONS.md) (You can open a PR to add your project!)

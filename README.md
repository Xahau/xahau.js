# xahau.js

A JavaScript/TypeScript library for interacting with the Xahau Ledger

[![NPM](https://nodei.co/npm/xahau.png)](https://www.npmjs.org/package/xahau)
![npm bundle size](https://img.shields.io/bundlephobia/min/xahau)

This is the recommended library for integrating a JavaScript/TypeScript app with the Xahau Ledger, especially if you intend to use advanced functionality such as IOUs, payment paths, the decentralized exchange, account settings, payment channels, escrows, multi-signing, and more.

<!-- ## [➡️ Reference Documentation](http://js.xahau.org)

See the full reference documentation for all classes, methods, and utilities.

## Features

1. Managing keys & creating test credentials ([`Wallet`](https://js.xahau.org/classes/Wallet.html) && [`Client.fundWallet()`](https://js.xahau.org/classes/Client.html#fundWallet))
2. Submitting transactions to the Xahau Ledger ([`Client.submit(...)`](https://js.xahau.org/classes/Client.html#submit) & [transaction types](https://xahau.org/transaction-types.html))
3. Sending requests to observe the ledger ([`Client.request(...)`](https://js.xahau.org/classes/Client.html#request) using [public API methods](https://xahau.org/public-api-methods.html))
4. Subscribing to changes in the ledger ([Ex. ledger, transactions, & more...](https://xahau.org/subscribe.html))
5. Parsing ledger data into more convenient formats ([`xrpToDrops`](https://js.xahau.org/functions/xrpToDrops.html) and [`rippleTimeToISOTime`](https://js.xahau.org/functions/rippleTimeToISOTime.html))

All of which works in Node.js (tested for v18+) & web browsers (tested for Chrome). -->

# Quickstart

### Requirements

+ **[Node.js v18](https://nodejs.org/)** is recommended. We also support v20. Other versions may work but are not frequently tested.

### Installing xahau.js

In an existing project (with package.json), install xahau.js with:

```
$ npm install --save xahau
```

Or with `yarn`:

```
$ yarn add xahau
```

Example usage:

```js
const xahau = require("xahau");
async function main() {
  const client = new xahau.Client("wss://xahau-test.net");
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

It goes through:

1. Creating a new test account
2. Sending a payment transaction
3. And sending requests to see your account balance!

### Case by Case Setup Steps

If you're using xahau.js with React or Deno, you'll need to do a couple extra steps to set it up:

- [Using xahau.js with a CDN](https://github.com/XRPLF/xahau.js/blob/main/UNIQUE_SETUPS.md#using-xahaujs-from-a-cdn)
- [Using xahau.js with `create-react-app`](https://github.com/XRPLF/xahau.js/blob/main/UNIQUE_SETUPS.md#using-xahaujs-with-create-react-app)
- [Using xahau.js with `React Native`](https://github.com/XRPLF/xahau.js/blob/main/UNIQUE_SETUPS.md#using-xahaujs-with-react-native)
- [Using xahau.js with `Vite React`](https://github.com/XRPLF/xahau.js/blob/main/UNIQUE_SETUPS.md#using-xahaujs-with-vite-react)
- [Using xahau.js with `Deno`](https://github.com/XRPLF/xahau.js/blob/main/UNIQUE_SETUPS.md#using-xahaujs-with-deno)

## Documentation

As you develop with xahau.js, there's two sites you'll use extensively:

1. [docs.xahau.network](https://docs.xahau.network/technical/protocol-reference) is the primary source for:
   - How the ledger works ([See Concepts](https://docs.xahau.network/))
   - What kinds of transactions there are ([Transaction Types](https://docs.xahau.network/technical/protocol-reference/transactions/transaction-types))
   - Requests you can send ([Public API Methods](https://docs.xahau.network/features/http-websocket-apis))

### Mailing Lists

If you want to hear when we release new versions of xahau.js, you can join our low-traffic mailing list (About 1 email per week):

- [Subscribe to xahau-announce](https://groups.google.com/g/xahau-announce)

If you're using the Xahau Ledger in production, you should run a [xahaud server](https://github.com/Xahau/xahaud) and subscribe to the xahau-server mailing list as well.

- [Subscribe to xahau-server](https://groups.google.com/g/xahau-server)

You are also welcome to create an [issue](https://github.com/Xahau/xahau.js/issues) here and we'll do our best to respond within 3 days.

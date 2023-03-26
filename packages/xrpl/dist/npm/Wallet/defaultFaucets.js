"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultFaucetPath = exports.getFaucetHost = exports.FaucetNetworkPaths = exports.FaucetNetwork = void 0;
const errors_1 = require("../errors");
var FaucetNetwork;
(function (FaucetNetwork) {
    FaucetNetwork["Testnet"] = "faucet.altnet.rippletest.net";
    FaucetNetwork["Devnet"] = "faucet.devnet.rippletest.net";
    FaucetNetwork["AMMDevnet"] = "ammfaucet.devnet.rippletest.net";
    FaucetNetwork["NFTDevnet"] = "faucet-nft.ripple.com";
    FaucetNetwork["HooksV2Testnet"] = "hooks-testnet-v2.xrpl-labs.com";
})(FaucetNetwork = exports.FaucetNetwork || (exports.FaucetNetwork = {}));
exports.FaucetNetworkPaths = {
    [FaucetNetwork.Testnet]: '/accounts',
    [FaucetNetwork.Devnet]: '/accounts',
    [FaucetNetwork.AMMDevnet]: '/accounts',
    [FaucetNetwork.NFTDevnet]: '/accounts',
    [FaucetNetwork.HooksV2Testnet]: '/accounts',
};
function getFaucetHost(client) {
    const connectionUrl = client.url;
    if (connectionUrl.includes('hooks-testnet-v2')) {
        return FaucetNetwork.HooksV2Testnet;
    }
    if (connectionUrl.includes('altnet') || connectionUrl.includes('testnet')) {
        return FaucetNetwork.Testnet;
    }
    if (connectionUrl.includes('amm')) {
        return FaucetNetwork.AMMDevnet;
    }
    if (connectionUrl.includes('devnet')) {
        return FaucetNetwork.Devnet;
    }
    if (connectionUrl.includes('xls20-sandbox')) {
        return FaucetNetwork.NFTDevnet;
    }
    throw new errors_1.XRPLFaucetError('Faucet URL is not defined or inferrable.');
}
exports.getFaucetHost = getFaucetHost;
function getDefaultFaucetPath(hostname) {
    if (hostname === undefined) {
        return '/accounts';
    }
    return exports.FaucetNetworkPaths[hostname] || '/accounts';
}
exports.getDefaultFaucetPath = getDefaultFaucetPath;
//# sourceMappingURL=defaultFaucets.js.map
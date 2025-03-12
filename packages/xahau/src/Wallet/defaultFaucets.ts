import type { Client } from '../client'
import { XRPLFaucetError } from '../errors'

export interface FaucetWallet {
  account: {
    xAddress: string
    classicAddress?: string
    secret: string
  }
  amount: number
  balance: number
}

export enum FaucetNetwork {
  Testnet = 'xahau-test.net',
  Devnet = 'jshooks.xahau-test.net',
}

export const FaucetNetworkPaths: Record<string, string> = {
  [FaucetNetwork.Testnet]: '/accounts',
  [FaucetNetwork.Devnet]: '/accounts',
}

/**
 * Get the faucet host based on the Client connection.
 *
 * @param client - Client.
 * @returns A {@link FaucetNetwork}.
 * @throws When the client url is not on devnet.
 */
export function getFaucetHost(client: Client): FaucetNetwork | undefined {
  const connectionUrl = client.url

  if (connectionUrl.includes('jshooks')) {
    return FaucetNetwork.Devnet
  }

  // 'altnet' for Ripple Testnet server and 'test' for XAHL Labs Testnet server
  if (connectionUrl.includes('test')) {
    return FaucetNetwork.Testnet
  }

  throw new XRPLFaucetError('Faucet URL is not defined or inferrable.')
}

/**
 * Get the faucet pathname based on the faucet hostname.
 *
 * @param hostname - hostname.
 * @returns A String with the correct path for the input hostname.
 * If hostname undefined or cannot find (key, value) pair in {@link FaucetNetworkPaths}, defaults to '/accounts'
 */
export function getDefaultFaucetPath(hostname: string | undefined): string {
  if (hostname === undefined) {
    return '/accounts'
  }
  return FaucetNetworkPaths[hostname] || '/accounts'
}

import type { Client } from '../client'
import { XAHLFaucetError } from '../errors'

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
  Testnet = 'xahau-test.net/accounts',
  Devnet = 'jshooks.xahau-test.net/accounts',
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
 * @throws When the client url is not on altnet or devnet.
 */
export function getFaucetHost(client: Client): FaucetNetwork | undefined {
  const connectionUrl = client.url

  // 'altnet' for Ripple Testnet server and 'testnet' for XRPL Labs Testnet server
  if (connectionUrl.includes('altnet') || connectionUrl.includes('testnet')) {
    return FaucetNetwork.Testnet
  }

  if (connectionUrl.includes('sidechain-net2')) {
    throw new XAHLFaucetError(
      'Cannot fund an account on an issuing chain. Accounts must be created via the bridge.',
    )
  }

  if (connectionUrl.includes('devnet')) {
    return FaucetNetwork.Devnet
  }

  if (connectionUrl.includes('jshooks')) {
    return FaucetNetwork.Devnet
  }

  if (connectionUrl.includes('xahau-test')) {
    return FaucetNetwork.Testnet
  }

  throw new XAHLFaucetError('Faucet URL is not defined or inferrable.')
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

import { Client, Wallet } from '../../src'
import { AccountSet, TrustSet, Payment } from '../../src/models/transactions'

import serverUrl from './serverUrl'
import { fundAccount, ledgerAccept } from './utils'

export interface XrplIntegrationTestContext {
  client: Client
  wallet: Wallet
  destination: Wallet
  gateway: Wallet
}

export async function teardownClient(
  context: XrplIntegrationTestContext,
): Promise<void> {
  context.client.removeAllListeners()
  return context.client.disconnect()
}

async function connectWithRetry(client: Client, tries = 0): Promise<void> {
  return client.connect().catch(async (error) => {
    if (tries < 10) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(connectWithRetry(client, tries + 1))
        }, 1000)
      })
    }

    throw error
  })
}

// eslint-disable-next-line max-params -- need comments
async function initToken(
  client: Client,
  wallet: Wallet,
  destination: Wallet,
  gateway: Wallet,
): Promise<void> {
  const atx: AccountSet = {
    TransactionType: 'AccountSet',
    Account: gateway.classicAddress,
    SetFlag: 8,
  }
  const atxr = await client.submit(atx, {
    wallet: gateway,
  })
  if (atxr.result.engine_result !== 'tesSUCCESS') {
    // eslint-disable-next-line no-console -- happens only when something goes wrong
    console.log(atxr)
  }
  await ledgerAccept(client)

  const wtl: TrustSet = {
    TransactionType: 'TrustSet',
    Account: wallet.classicAddress,
    LimitAmount: {
      currency: 'USD',
      issuer: gateway.classicAddress,
      value: '100000',
    },
  }

  const wtlr = await client.submit(wtl, {
    wallet,
  })
  if (wtlr.result.engine_result !== 'tesSUCCESS') {
    // eslint-disable-next-line no-console -- happens only when something goes wrong
    console.log(wtlr)
  }
  await ledgerAccept(client)

  const dtl: TrustSet = {
    TransactionType: 'TrustSet',
    Account: destination.classicAddress,
    LimitAmount: {
      currency: 'USD',
      issuer: gateway.classicAddress,
      value: '100000',
    },
  }

  const dtlr = await client.submit(dtl, {
    wallet: destination,
  })
  if (wtlr.result.engine_result !== 'tesSUCCESS') {
    // eslint-disable-next-line no-console -- happens only when something goes wrong
    console.log(dtlr)
  }
  await ledgerAccept(client)

  const wp: Payment = {
    TransactionType: 'Payment',
    Account: gateway.classicAddress,
    Destination: wallet.classicAddress,
    Amount: {
      currency: 'USD',
      issuer: gateway.classicAddress,
      value: '10000',
    },
  }

  const wpr = await client.submit(wp, {
    wallet: gateway,
  })
  if (wpr.result.engine_result !== 'tesSUCCESS') {
    // eslint-disable-next-line no-console -- happens only when something goes wrong
    console.log(wpr)
  }
  await ledgerAccept(client)

  const dp: Payment = {
    TransactionType: 'Payment',
    Account: gateway.classicAddress,
    Destination: destination.classicAddress,
    Amount: {
      currency: 'USD',
      issuer: gateway.classicAddress,
      value: '10000',
    },
  }

  const dpr = await client.submit(dp, {
    wallet: gateway,
  })
  if (dpr.result.engine_result !== 'tesSUCCESS') {
    // eslint-disable-next-line no-console -- happens only when something goes wrong
    console.log(dpr)
  }
  await ledgerAccept(client)
}

export async function setupClient(
  server = serverUrl,
  token?: boolean | false,
): Promise<XrplIntegrationTestContext> {
  const context: XrplIntegrationTestContext = {
    client: new Client(server, { timeout: 200000 }),
    wallet: Wallet.generate(),
    destination: Wallet.generate(),
    gateway: Wallet.generate(),
  }
  return connectWithRetry(context.client).then(async () => {
    await fundAccount(context.client, context.wallet, {
      count: 20,
      delayMs: 1000,
    })
    if (token) {
      await fundAccount(context.client, context.destination, {
        count: 20,
        delayMs: 1000,
      })
      await fundAccount(context.client, context.gateway, {
        count: 20,
        delayMs: 1000,
      })
      await initToken(
        context.client,
        context.wallet,
        context.destination,
        context.gateway,
      )
    }
    return context
  })
}

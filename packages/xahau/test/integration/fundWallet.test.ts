import { assert } from 'chai'

import {
  Client,
  isValidClassicAddress,
  isValidXAddress,
  dropsToXah,
} from '../../src'

// This test is reliant on external networks, and as such may be flaky.
// Retry transient failures (e.g. connection timeouts) up to MAX_ATTEMPTS times.
const MAX_ATTEMPTS = 3

async function withRetry(fn: () => Promise<void>, attempt = 1): Promise<void> {
  try {
    await fn()
  } catch (error) {
    if (attempt >= MAX_ATTEMPTS) {
      throw error
    }
    // eslint-disable-next-line no-console -- surface retries in CI logs
    console.warn(`fundWallet attempt ${attempt} failed, retrying:`, error)
    await withRetry(fn, attempt + 1)
  }
}

async function generate_faucet_wallet_and_fund_again(
  client: string,
  faucetHost: string | undefined = undefined,
  faucetPath: string | undefined = undefined,
): Promise<void> {
  const api = new Client(client)

  await api.connect()
  try {
    const { wallet, balance } = await api.fundWallet(null, {
      faucetHost,
      faucetPath,
      usageContext: 'integration-test',
    })
    assert.notStrictEqual(wallet, undefined)
    assert(isValidClassicAddress(wallet.classicAddress))
    assert(isValidXAddress(wallet.getXAddress()))

    const info = await api.request({
      command: 'account_info',
      account: wallet.classicAddress,
    })

    assert.equal(dropsToXah(info.result.account_data.Balance), balance)
  } finally {
    await api.disconnect()
  }
}

// how long before each test case times out
const TIMEOUT = 60000
describe('fundWallet', function () {
  it(
    'submit generates a testnet wallet',
    async function () {
      await withRetry(async () =>
        generate_faucet_wallet_and_fund_again('wss://xahau-test.net'),
      )
    },
    TIMEOUT,
  )
})

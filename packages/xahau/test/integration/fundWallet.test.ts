import { assert } from 'chai'

import {
  Client,
  isValidClassicAddress,
  isValidXAddress,
  dropsToXah,
} from '../../src'

async function generate_faucet_wallet_and_fund_again(
  client: string,
  faucetHost: string | undefined = undefined,
  faucetPath: string | undefined = undefined,
): Promise<void> {
  const api = new Client(client)

  await api.connect()

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
  await api.disconnect()
}

// how long before each test case times out
const TIMEOUT = 60000
// This test is reliant on external networks, and as such may be flaky.
describe('fundWallet', function () {
  it(
    'submit generates a testnet wallet',
    async function () {
      await generate_faucet_wallet_and_fund_again('wss://xahau-test.net')
    },
    TIMEOUT,
  )
})

import { assert } from 'chai'

import {
  AccountInfoRequest,
  AccountSet,
  convertStringToHex,
  LedgerEntryRequest,
  XahaudError,
} from '../../../src'
import { AppLoader } from '../../../src/models/ledger'
import serverUrl from '../serverUrl'
import {
  setupClient,
  teardownClient,
  type XrplIntegrationTestContext,
} from '../setup'
import { testTransaction } from '../utils'

// how long before each test case times out
const TIMEOUT = 20000

describe('AccountSet', function () {
  let testContext: XrplIntegrationTestContext

  beforeEach(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterEach(async () => teardownClient(testContext))

  it(
    'base',
    async () => {
      const tx: AccountSet = {
        TransactionType: 'AccountSet',
        Account: testContext.wallet.classicAddress,
      }
      await testTransaction(testContext.client, tx, testContext.wallet)
    },
    TIMEOUT,
  )

  it(
    'AppLoader',
    async () => {
      const account = testContext.wallet.classicAddress
      const appLoader = convertStringToHex(
        '<!DOCTYPE html><html><body>hi</body></html>',
      )
      const set: AccountSet = {
        TransactionType: 'AccountSet',
        Account: account,
        AppLoader: appLoader,
      }
      await testTransaction(testContext.client, set, testContext.wallet)

      const entryRequest: LedgerEntryRequest = {
        command: 'ledger_entry',
        app_loader: account,
        ledger_index: 'validated',
      }
      const entry = await testContext.client.request(entryRequest)
      const node = entry.result.node as AppLoader
      assert.equal(node.LedgerEntryType, 'AppLoader')
      assert.equal(node.Owner, account)
      assert.equal(node.AppLoader, appLoader)
      assert.equal(node.AppLoaderSequence, 1)

      const infoRequest: AccountInfoRequest = {
        command: 'account_info',
        account,
        ledger_index: 'validated',
      }
      const info = await testContext.client.request(infoRequest)
      assert.equal(info.result.account_data.AppLoaderSequence, 1)

      const remove: AccountSet = {
        TransactionType: 'AccountSet',
        Account: account,
        AppLoader: '',
      }
      await testTransaction(testContext.client, remove, testContext.wallet)

      let error: unknown
      try {
        await testContext.client.request(entryRequest)
      } catch (err) {
        error = err
      }
      assert.instanceOf(error, XahaudError)
      assert.equal(
        ((error as XahaudError).data as { error: string }).error,
        'entryNotFound',
      )

      const infoAfter = await testContext.client.request(infoRequest)
      assert.equal(infoAfter.result.account_data.AppLoaderSequence, 2)
    },
    TIMEOUT,
  )
})

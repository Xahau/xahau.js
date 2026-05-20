import { stringToHex } from '@xrplf/isomorphic/utils'

import { Remit } from '../../../src'
import serverUrl from '../serverUrl'
import {
  setupClient,
  teardownClient,
  type XrplIntegrationTestContext,
} from '../setup'
import { generateFundedWallet, testTransaction } from '../utils'

// how long before each test case times out
const TIMEOUT = 20000

describe('Remit', function () {
  let testContext: XrplIntegrationTestContext

  beforeEach(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterEach(async () => teardownClient(testContext))

  it(
    'base',
    async () => {
      const wallet2 = await generateFundedWallet(testContext.client)
      const tx: Remit = {
        TransactionType: 'Remit',
        Account: testContext.wallet.classicAddress,
        Destination: wallet2.classicAddress,
      }

      await testTransaction(testContext.client, tx, testContext.wallet)
    },
    TIMEOUT,
  )
  it(
    'amt',
    async () => {
      const wallet2 = await generateFundedWallet(testContext.client)
      const tx: Remit = {
        TransactionType: 'Remit',
        Account: testContext.wallet.classicAddress,
        Destination: wallet2.classicAddress,
        Amounts: [
          {
            AmountEntry: {
              Amount: '1000000',
            },
          },
        ],
      }

      await testTransaction(testContext.client, tx, testContext.wallet)
    },
    TIMEOUT,
  )
  it(
    'mint',
    async () => {
      const wallet2 = await generateFundedWallet(testContext.client)
      const tx: Remit = {
        TransactionType: 'Remit',
        Account: testContext.wallet.classicAddress,
        Destination: wallet2.classicAddress,
        MintURIToken: {
          URI: stringToHex('https://example.com'),
          Flags: {
            tfBurnable: true,
          },
        },
      }

      await testTransaction(testContext.client, tx, testContext.wallet)
    },
    TIMEOUT,
  )
})

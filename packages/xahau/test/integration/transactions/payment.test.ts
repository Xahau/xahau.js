import { Payment, Wallet } from '../../../src'
import serverUrl from '../serverUrl'
import {
  setupClient,
  teardownClient,
  type XrplIntegrationTestContext,
} from '../setup'
import { generateFundedWallet, testTransaction } from '../utils'

// how long before each test case times out
const TIMEOUT = 20000

describe('Payment', function () {
  let testContext: XrplIntegrationTestContext
  // This wallet is used for DeliverMax related tests
  let senderWallet: Wallet

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
    senderWallet = await generateFundedWallet(testContext.client)
  })
  afterAll(async () => teardownClient(testContext))

  it(
    'base',
    async () => {
      const tx: Payment = {
        TransactionType: 'Payment',
        Account: testContext.wallet.classicAddress,
        Destination: senderWallet.classicAddress,
        Amount: '1000',
      }
      await testTransaction(testContext.client, tx, testContext.wallet)
    },
    TIMEOUT,
  )
})

import { PaymentChannelCreate, hashes, PaymentChannelFund } from '../../../src'
import serverUrl from '../serverUrl'
import {
  setupClient,
  teardownClient,
  type XrplIntegrationTestContext,
} from '../setup'
import { testTransaction } from '../utils'

// how long before each test case times out
const TIMEOUT = 20000
const { hashPaymentChannel } = hashes

describe('PaymentChannelClaim', function () {
  let testContext: XrplIntegrationTestContext

  beforeEach(async () => {
    testContext = await setupClient(serverUrl, true)
  })
  afterEach(async () => teardownClient(testContext))

  it(
    'test xrp',
    async () => {
      const paymentChannelCreate: PaymentChannelCreate = {
        TransactionType: 'PaymentChannelCreate',
        Account: testContext.wallet.classicAddress,
        Amount: '100',
        Destination: testContext.destination.classicAddress,
        SettleDelay: 86400,
        PublicKey: testContext.wallet.publicKey,
      }

      const paymentChannelResponse = await testContext.client.submit(
        paymentChannelCreate,
        { wallet: testContext.wallet },
      )

      await testTransaction(
        testContext.client,
        paymentChannelCreate,
        testContext.wallet,
      )

      const paymentChannelFund: PaymentChannelFund = {
        Account: testContext.wallet.classicAddress,
        TransactionType: 'PaymentChannelFund',
        Channel: hashPaymentChannel(
          testContext.wallet.classicAddress,
          testContext.destination.classicAddress,
          paymentChannelResponse.result.tx_json.Sequence ?? 0,
        ),
        Amount: '100',
      }

      await testTransaction(
        testContext.client,
        paymentChannelFund,
        testContext.wallet,
      )
    },
    TIMEOUT,
  )
  it(
    'test token',
    async () => {
      const paymentChannelCreate: PaymentChannelCreate = {
        TransactionType: 'PaymentChannelCreate',
        Account: testContext.wallet.classicAddress,
        Amount: {
          currency: 'USD',
          issuer: testContext.gateway.classicAddress,
          value: '100',
        },
        Destination: testContext.destination.classicAddress,
        SettleDelay: 86400,
        PublicKey: testContext.wallet.publicKey,
      }

      const paymentChannelResponse = await testContext.client.submit(
        paymentChannelCreate,
        { wallet: testContext.wallet },
      )

      const paymentChannelFund: PaymentChannelFund = {
        Account: testContext.wallet.classicAddress,
        TransactionType: 'PaymentChannelFund',
        Channel: hashPaymentChannel(
          testContext.wallet.classicAddress,
          testContext.destination.classicAddress,
          paymentChannelResponse.result.tx_json.Sequence ?? 0,
        ),
        Amount: {
          currency: 'USD',
          issuer: testContext.gateway.classicAddress,
          value: '100',
        },
      }

      await testTransaction(
        testContext.client,
        paymentChannelFund,
        testContext.wallet,
      )
    },
    TIMEOUT,
  )
})

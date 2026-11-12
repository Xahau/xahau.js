import { assert } from 'chai'
import { decode } from 'xahau-binary-codec'

import {
  AccountInfoRequest,
  AccountInfoResponse,
  AccountSet,
  Payment,
  SubmitRequest,
  SubmitResponse,
  Transaction,
  TxRequest,
  TxResponse,
  XAHAUD_API_V2,
  hashes,
} from '../../../src'
import { transactionTimeToUnixTime } from '../../../src/utils'
import serverUrl from '../serverUrl'
import {
  setupClient,
  teardownClient,
  type XrplIntegrationTestContext,
} from '../setup'
import {
  generateFundedWallet,
  getLedgerCloseTime,
  ledgerAccept,
  verifySubmittedTransaction,
} from '../utils'

// how long before each test case times out
const TIMEOUT = 20000
const RIPPLE_EPOCH_DIFF_MS = 946684800000

describe('submit JsonTx', function () {
  let testContext: XrplIntegrationTestContext

  beforeEach(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterEach(async () => teardownClient(testContext))

  // the ledger clock of a standalone node differs from the wall clock
  async function ledgerTime(offsetMs: number): Promise<string> {
    const closeTime = await getLedgerCloseTime(testContext.client)
    return (closeTime * 1000 + offsetMs).toString(16)
  }

  async function accountInfo(
    account: string,
  ): Promise<AccountInfoResponse['result']['account_data']> {
    const request: AccountInfoRequest = {
      command: 'account_info',
      account,
      ledger_index: 'validated',
    }
    const response: AccountInfoResponse =
      await testContext.client.request(request)
    return response.result.account_data
  }

  async function getTx(hash: string): Promise<TxResponse['result']> {
    const request: TxRequest = {
      command: 'tx',
      transaction: hash,
      api_version: XAHAUD_API_V2,
    }
    const response: TxResponse = await testContext.client.request(request)
    return response.result
  }

  it(
    'submits a time-sequenced JsonTx',
    async () => {
      const { client } = testContext
      const wallet = await generateFundedWallet(client)
      const sequenceBefore = (await accountInfo(wallet.classicAddress)).Sequence
      const time = await ledgerTime(1)

      const payment: Payment = {
        TransactionType: 'Payment',
        Account: wallet.classicAddress,
        Destination: 'rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy',
        Amount: '100000000',
        Time: time,
      }
      const autofilled = await client.autofill(payment)
      assert.equal(autofilled.Sequence, 0)

      const { tx, sig } = wallet.signJsonTx(autofilled)
      const request: SubmitRequest = { command: 'submit', tx, sig }
      const response: SubmitResponse = await client.request(request)

      assert.equal(response.result.engine_result, 'tesSUCCESS')
      assert.equal(response.result.tx_json.Sequence, 0)
      assert.isString(response.result.tx_json.JsonTxDelta)
      assert.equal(
        hashes.hashSignedTx(response.result.tx_blob),
        response.result.tx_json.hash,
      )

      await ledgerAccept(client)

      const validated = await getTx(response.result.tx_json.hash as string)
      assert.isTrue(validated.validated)
      assert.equal(validated.tx_json.Sequence, 0)
      assert.isString(validated.tx_json.JsonTxDelta)
      assert.equal(
        parseInt(validated.tx_json.Time as string, 16),
        parseInt(time, 16),
      )

      const info = await accountInfo(wallet.classicAddress)
      assert.equal(info.Sequence, sequenceBefore)
      assert.equal(
        transactionTimeToUnixTime(info.LastTxnTime as string),
        parseInt(time, 16) + RIPPLE_EPOCH_DIFF_MS,
      )

      const replay = await client.request(request)
      assert.equal(replay.result.engine_result, 'tefPAST_SEQ')
    },
    TIMEOUT,
  )

  it(
    'submits a JsonTx sequenced by Sequence',
    async () => {
      const { client } = testContext
      const wallet = await generateFundedWallet(client)
      const sequenceBefore = (await accountInfo(wallet.classicAddress)).Sequence

      const payment: Payment = {
        TransactionType: 'Payment',
        Account: wallet.classicAddress,
        Destination: 'rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy',
        Amount: '100000000',
      }
      const { tx, sig } = wallet.signJsonTx(await client.autofill(payment))
      const request: SubmitRequest = { command: 'submit', tx, sig }
      const response = await client.request(request)

      assert.equal(response.result.engine_result, 'tesSUCCESS')

      await ledgerAccept(client)

      assert.equal(
        (await accountInfo(wallet.classicAddress)).Sequence,
        sequenceBefore + 1,
      )
      const validated = await getTx(response.result.tx_json.hash as string)
      assert.isTrue(validated.validated)
      assert.isString(validated.tx_json.JsonTxDelta)
      assert.isUndefined(validated.tx_json.Time)
    },
    TIMEOUT,
  )

  it(
    'submits a binary-signed time-sequenced transaction',
    async () => {
      const { client } = testContext
      const wallet = await generateFundedWallet(client)
      const time = await ledgerTime(1)

      const accountSet: AccountSet = {
        TransactionType: 'AccountSet',
        Account: wallet.classicAddress,
        Time: time,
      }
      const autofilled = await client.autofill(accountSet)
      assert.equal(autofilled.Sequence, 0)

      const signed = wallet.sign(autofilled)
      const request: SubmitRequest = {
        command: 'submit',
        tx_blob: signed.tx_blob,
      }
      const response = await client.request(request)
      assert.equal(response.result.engine_result, 'tesSUCCESS')

      await ledgerAccept(client)
      // the node spells Time in lowercase unpadded hex, the codec in 16 uppercase digits
      await verifySubmittedTransaction(
        client,
        { ...(decode(signed.tx_blob) as unknown as Transaction), Time: time },
        signed.hash,
      )

      const info = await accountInfo(wallet.classicAddress)
      assert.equal(
        transactionTimeToUnixTime(info.LastTxnTime as string),
        parseInt(time, 16) + RIPPLE_EPOCH_DIFF_MS,
      )

      const replay = await client.request(request)
      assert.equal(replay.result.engine_result, 'tefPAST_SEQ')
    },
    TIMEOUT,
  )
})

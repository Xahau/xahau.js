import { assert } from 'chai'

import {
  LedgerEntryRequest,
  LedgerEntryResponse,
  XahaudError,
} from '../../../src'
import serverUrl from '../serverUrl'
import {
  setupClient,
  teardownClient,
  type XrplIntegrationTestContext,
} from '../setup'

// how long before each test case times out
const TIMEOUT = 20000

describe('ledger_entry', function () {
  let testContext: XrplIntegrationTestContext

  beforeEach(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterEach(async () => teardownClient(testContext))

  it(
    'base',
    async () => {
      const validatedLedgerResponse = await testContext.client.request({
        command: 'ledger_data',
        ledger_index: 'validated',
      })

      assert.equal(validatedLedgerResponse.type, 'response')
      const ledgerEntryIndex = validatedLedgerResponse.result.state[0].index

      const ledgerEntryRequest: LedgerEntryRequest = {
        command: 'ledger_entry',
        index: ledgerEntryIndex,
      }

      const ledgerEntryResponse =
        await testContext.client.request(ledgerEntryRequest)

      const expectedResponse: LedgerEntryResponse = {
        api_version: 1,
        id: ledgerEntryResponse.id,
        type: 'response',
        result: {
          index: ledgerEntryIndex,
          ledger_current_index: ledgerEntryResponse.result.ledger_current_index,
          node: ledgerEntryResponse.result.node,
          validated: false,
        },
      }

      assert.equal(ledgerEntryResponse.type, 'response')
      assert.deepEqual(ledgerEntryResponse, expectedResponse)
    },
    TIMEOUT,
  )

  it(
    'random',
    async () => {
      // The Random entry is created by validators' Entropy pseudo-transactions.
      // A standalone node has no validators, so the entry does not exist.
      let thrown: unknown
      try {
        await testContext.client.request({
          command: 'ledger_entry',
          random: true,
          ledger_index: 'validated',
        })
      } catch (error) {
        thrown = error
      }
      assert.instanceOf(thrown, XahaudError)
      assert.equal(
        (thrown as XahaudError & { data: { error: string } }).data.error,
        'entryNotFound',
      )
    },
    TIMEOUT,
  )

  it(
    'Export entries that do not exist',
    async () => {
      // None of them exists on a node without exporters or exports; each
      // selector is parsed by the server, so a malformed one would be another
      // error.
      const account = testContext.wallet.classicAddress
      const selectors: Array<Partial<LedgerEntryRequest>> = [
        { exporter: { account, network_id: 0 } },
        { shadow_ticket: { account, network_id: 0, ticket_seq: 1 } },
        { exported_txn: { seq: 1, transaction_hash: '0'.repeat(64) } },
        { export_fee: { network_id: 1 } },
      ]
      for (const selector of selectors) {
        let thrown: unknown
        try {
          // eslint-disable-next-line no-await-in-loop -- sequential on purpose
          await testContext.client.request({
            command: 'ledger_entry',
            ledger_index: 'validated',
            ...selector,
          })
        } catch (error) {
          thrown = error
        }
        assert.instanceOf(thrown, XahaudError)
        assert.equal(
          (thrown as XahaudError & { data: { error: string } }).data.error,
          'entryNotFound',
          JSON.stringify(selector),
        )
      }
    },
    TIMEOUT,
  )
})

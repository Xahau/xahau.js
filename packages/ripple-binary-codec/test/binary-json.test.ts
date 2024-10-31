import fixtures from './fixtures/codec-fixtures.json'
import xrplDefinitions from '../src/enums/definitions.json'
import { decode, encode, decodeLedgerData, XrplDefinitions } from '../src'

function json(object) {
  return JSON.stringify(object)
}

function truncateForDisplay(longStr) {
  return `${longStr.slice(0, 10)} ... ${longStr.slice(-10)}`
}

const definitions = new XrplDefinitions(xrplDefinitions)

describe('ripple-binary-codec', function () {
  function makeSuite(name, entries) {
    describe(name, function () {
      entries.forEach((t, testN) => {
        it(`${name}[${testN}] can encode ${truncateForDisplay(
          json(t.json),
        )} to ${truncateForDisplay(t.binary)}`, () => {
          expect(encode(t.json, definitions)).toEqual(t.binary)
        })
        it(`${name}[${testN}] can decode ${truncateForDisplay(
          t.binary,
        )} to ${truncateForDisplay(json(t.json))}`, () => {
          const decoded = decode(t.binary, definitions)
          expect(decoded).toEqual(t.json)
        })
      })
    })
  }
  makeSuite('transactions', fixtures.transactions)
  makeSuite('accountState', fixtures.accountState)

  describe('ledgerData', function () {
    if (fixtures.ledgerData) {
      fixtures.ledgerData.forEach((t, testN) => {
        it(`ledgerData[${testN}] can decode ${t.binary} to ${json(
          t.json,
        )}`, () => {
          const decoded = decodeLedgerData(t.binary)
          expect(t.json).toEqual(decoded)
        })
      })
    }
  })
})

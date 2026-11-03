import { coreTypes } from '../src/types'
import fixtures from './fixtures/data-driven-tests.json'
const { Amount } = coreTypes

function amountErrorTests() {
  fixtures.values_tests
    .filter((obj) => obj.type === 'Amount')
    .forEach((f) => {
      // We only want these with errors
      if (!f.error) {
        return
      }
      const testName =
        `${JSON.stringify(f.test_json)}\n\tis invalid ` + `because: ${f.error}`
      it(testName, () => {
        expect(() => {
          Amount.from(f.test_json)
          JSON.stringify(f.test_json)
        }).toThrow()
      })
    })
}

describe('Amount', function () {
  it('can be parsed from', function () {
    expect(Amount.from('1000000') instanceof Amount).toBe(true)
    expect(Amount.from('1000000').toJSON()).toEqual('1000000')
    const fixture = {
      value: '1',
      issuer: '0000000000000000000000000000000000000000',
      currency: 'USD',
    }
    const amt = Amount.from(fixture)
    const rewritten = {
      value: '1',
      issuer: 'rrrrrrrrrrrrrrrrrrrrrhoLvTp',
      currency: 'USD',
    }
    expect(amt.toJSON()).toEqual(rewritten)
  })

  it('toJSON() does not mutate internal buffer for native XRP amounts', function () {
    const amt = Amount.from('1000000')
    const serializedHexBeforeJsonCalls = amt.toHex()
    const firstJsonResult = amt.toJSON()
    const secondJsonResult = amt.toJSON()
    expect(secondJsonResult).toEqual(firstJsonResult)
    expect(amt.toHex()).toEqual(serializedHexBeforeJsonCalls)
  })

  it('toJSON() does not mutate internal buffer for IOU amounts', function () {
    const amt = Amount.from({
      value: '1',
      issuer: '0000000000000000000000000000000000000000',
      currency: 'USD',
    })
    const serializedHexBeforeJsonCalls = amt.toHex()
    const firstJsonResult = amt.toJSON()
    const secondJsonResult = amt.toJSON()
    expect(secondJsonResult).toEqual(firstJsonResult)
    expect(amt.toHex()).toEqual(serializedHexBeforeJsonCalls)
  })

  it('toJSON() does not mutate internal buffer for negative IOU amounts', function () {
    const amt = Amount.from({
      value: '-1',
      issuer: '0000000000000000000000000000000000000000',
      currency: 'USD',
    })
    const serializedHexBeforeJsonCalls = amt.toHex()
    const firstJsonResult = amt.toJSON()
    const secondJsonResult = amt.toJSON()
    expect(secondJsonResult).toEqual(firstJsonResult)
    expect(amt.toHex()).toEqual(serializedHexBeforeJsonCalls)
  })

  amountErrorTests()
})

import BigNumber from 'bignumber.js'
import { assert } from 'chai'

import { xahToDrops } from '../../src/utils'

describe('xahToDrops', function () {
  it('works with a typical amount', function () {
    const drops = xahToDrops('2')
    assert.strictEqual(drops, '2000000', '2 XRP equals 2 million drops')
  })

  it('works with fractions', function () {
    let drops = xahToDrops('3.456789')
    assert.strictEqual(drops, '3456789', '3.456789 XRP equals 3,456,789 drops')
    drops = xahToDrops('3.400000')
    assert.strictEqual(drops, '3400000', '3.400000 XRP equals 3,400,000 drops')
    drops = xahToDrops('0.000001')
    assert.strictEqual(drops, '1', '0.000001 XRP equals 1 drop')
    drops = xahToDrops('0.0000010')
    assert.strictEqual(drops, '1', '0.0000010 XRP equals 1 drop')
  })

  it('works with zero', function () {
    let drops = xahToDrops('0')
    assert.strictEqual(drops, '0', '0 XRP equals 0 drops')
    // negative zero is equivalent to zero
    drops = xahToDrops('-0')
    assert.strictEqual(drops, '0', '-0 XRP equals 0 drops')
    drops = xahToDrops('0.000000')
    assert.strictEqual(drops, '0', '0.000000 XRP equals 0 drops')
    drops = xahToDrops('0.0000000')
    assert.strictEqual(drops, '0', '0.0000000 XRP equals 0 drops')
  })

  it('works with a negative value', function () {
    const drops = xahToDrops('-2')
    assert.strictEqual(drops, '-2000000', '-2 XRP equals -2 million drops')
  })

  it('works with a value ending with a decimal point', function () {
    let drops = xahToDrops('2.')
    assert.strictEqual(drops, '2000000', '2. XRP equals 2000000 drops')
    drops = xahToDrops('-2.')
    assert.strictEqual(drops, '-2000000', '-2. XRP equals -2000000 drops')
  })

  it('works with BigNumber objects', function () {
    let drops = xahToDrops(new BigNumber(2))
    assert.strictEqual(
      drops,
      '2000000',
      '(BigNumber) 2 XRP equals 2 million drops',
    )
    drops = xahToDrops(new BigNumber(-2))
    assert.strictEqual(
      drops,
      '-2000000',
      '(BigNumber) -2 XRP equals -2 million drops',
    )
  })

  it('works with a number', function () {
    // This is not recommended. Use strings or BigNumber objects to avoid precision errors.
    const drops = xahToDrops(2)
    assert.strictEqual(
      drops,
      '2000000',
      '(number) 2 XRP equals 2 million drops',
    )
    const drops2 = xahToDrops(-2)
    assert.strictEqual(
      drops2,
      '-2000000',
      '(number) -2 XRP equals -2 million drops',
    )
  })

  it('works with scientific notation', function () {
    const drops = xahToDrops('1e-6')
    assert.strictEqual(
      drops,
      '1',
      '(scientific notation string) 1e-6 XRP equals 1 drop',
    )
  })

  it('throws with an amount with too many decimal places', function () {
    assert.throws(() => {
      xahToDrops('1.1234567')
    }, /has too many decimal places/u)
    assert.throws(() => {
      xahToDrops('0.0000001')
    }, /has too many decimal places/u)
  })

  it('throws with an invalid value', function () {
    assert.throws(() => {
      xahToDrops('FOO')
    }, /invalid value/u)
    assert.throws(() => {
      xahToDrops('1e-7')
    }, /decimal place/u)
    assert.throws(() => {
      xahToDrops('2,0')
    }, /invalid value/u)
    assert.throws(() => {
      xahToDrops('.')
    }, /xahToDrops: invalid value '\.', should be a BigNumber or string-encoded number\./u)
  })

  it('throws with an amount more than one decimal point', function () {
    assert.throws(() => {
      xahToDrops('1.0.0')
    }, /xahToDrops: invalid value '1\.0\.0'/u)
    assert.throws(() => {
      xahToDrops('...')
    }, /xahToDrops: invalid value '\.\.\.'/u)
  })
})

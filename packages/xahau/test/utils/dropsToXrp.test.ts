import BigNumber from 'bignumber.js'
import { assert } from 'chai'

import { dropsToXah } from '../../src/utils'

describe('dropsToXah', function () {
  it('works with a typical amount', function () {
    const xrp = dropsToXah('2000000')
    assert.strictEqual(xrp, 2, '2 million drops equals 2 XRP')
  })

  it('works with fractions', function () {
    let xrp = dropsToXah('3456789')
    assert.strictEqual(xrp, 3.456789, '3,456,789 drops equals 3.456789 XRP')

    xrp = dropsToXah('3400000')
    assert.strictEqual(xrp, 3.4, '3,400,000 drops equals 3.4 XRP')

    xrp = dropsToXah('1')
    assert.strictEqual(xrp, 0.000001, '1 drop equals 0.000001 XRP')

    xrp = dropsToXah('1.0')
    assert.strictEqual(xrp, 0.000001, '1.0 drops equals 0.000001 XRP')

    xrp = dropsToXah('1.00')
    assert.strictEqual(xrp, 0.000001, '1.00 drops equals 0.000001 XRP')
  })

  it('works with zero', function () {
    let xrp = dropsToXah('0')
    assert.strictEqual(xrp, 0, '0 drops equals 0 XRP')

    // negative zero is equivalent to zero
    xrp = dropsToXah('-0')
    assert.strictEqual(xrp, 0, '-0 drops equals 0 XRP')

    xrp = dropsToXah('0.00')
    assert.strictEqual(xrp, 0, '0.00 drops equals 0 XRP')

    xrp = dropsToXah('000000000')
    assert.strictEqual(xrp, 0, '000000000 drops equals 0 XRP')
  })

  it('works with a negative value', function () {
    const xrp = dropsToXah('-2000000')
    assert.strictEqual(xrp, -2, '-2 million drops equals -2 XRP')
  })

  it('works with a value ending with a decimal point', function () {
    let xrp = dropsToXah('2000000.')
    assert.strictEqual(xrp, 2, '2000000. drops equals 2 XRP')

    xrp = dropsToXah('-2000000.')
    assert.strictEqual(xrp, -2, '-2000000. drops equals -2 XRP')
  })

  it('works with BigNumber objects', function () {
    let xrp = dropsToXah(new BigNumber(2000000))
    assert.strictEqual(xrp, 2, '(BigNumber) 2 million drops equals 2 XRP')

    xrp = dropsToXah(new BigNumber(-2000000))
    assert.strictEqual(xrp, -2, '(BigNumber) -2 million drops equals -2 XRP')

    xrp = dropsToXah(new BigNumber(2345678))
    assert.strictEqual(
      xrp,
      2.345678,
      '(BigNumber) 2,345,678 drops equals 2.345678 XRP',
    )

    xrp = dropsToXah(new BigNumber(-2345678))
    assert.strictEqual(
      xrp,
      -2.345678,
      '(BigNumber) -2,345,678 drops equals -2.345678 XRP',
    )
  })

  it('works with a number', function () {
    // This is not recommended. Use strings or BigNumber objects to avoid precision errors.
    let xrp = dropsToXah(2000000)
    assert.strictEqual(xrp, 2, '(number) 2 million drops equals 2 XRP')
    xrp = dropsToXah(-2000000)
    assert.strictEqual(xrp, -2, '(number) -2 million drops equals -2 XRP')
  })

  it('works with scientific notation', function () {
    const xrp = dropsToXah('1e6')
    assert.strictEqual(
      xrp,
      1,
      '(scientific notation string) 1e6 drops equals 1 XRP',
    )
  })

  it('throws with an amount with too many decimal places', function () {
    assert.throws(() => {
      dropsToXah(1.2)
    }, /has too many decimal places/u)

    assert.throws(() => {
      dropsToXah(0.1)
    }, /has too many decimal places/u)
  })

  it('throws with an invalid value', function () {
    assert.throws(() => {
      dropsToXah('FOO')
    }, /invalid value/u)

    assert.throws(() => {
      dropsToXah('1e-7')
    }, /decimal place/u)

    assert.throws(() => {
      dropsToXah('2,0')
    }, /invalid value/u)

    assert.throws(() => {
      dropsToXah('.')
    }, /dropsToXah: invalid value '\.', should be a BigNumber or string-encoded number\./u)
  })

  it('throws with an amount more than one decimal point', function () {
    assert.throws(() => {
      dropsToXah('1.0.0')
    }, /dropsToXah: invalid value '1\.0\.0'/u)

    assert.throws(() => {
      dropsToXah('...')
    }, /dropsToXah: invalid value '\.\.\.'/u)
  })
})

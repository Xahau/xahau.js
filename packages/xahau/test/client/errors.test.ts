import { assert } from 'chai'

import { XahlError, NotFoundError } from '../../src'

describe('client errors', function () {
  it('XahlError with data', async function () {
    const error = new XahlError('_message_', '_data_')
    assert.strictEqual(error.toString(), '[XahlError(_message_, "_data_")]')
  })

  it('NotFoundError default message', async function () {
    const error = new NotFoundError()
    assert.strictEqual(error.toString(), '[NotFoundError(Not found)]')
  })
})

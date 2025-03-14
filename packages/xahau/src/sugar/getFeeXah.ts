import BigNumber from 'bignumber.js'

import { type Client } from '..'
import { XahlError } from '../errors'

const NUM_DECIMAL_PLACES = 6
const BASE_10 = 10

/**
 * Calculates the current transaction fee for the ledger.
 * Note: This is a public API that can be called directly.
 *
 * @param client - The Client used to connect to the ledger.
 * @param cushion - The fee cushion to use.
 * @returns The transaction fee.
 */
export default async function getFeeXrp(
  client: Client,
  cushion?: number,
): Promise<string> {
  const feeCushion = cushion ?? client.feeCushion

  const serverInfo = (
    await client.request({
      command: 'server_info',
    })
  ).result.info

  const baseFee = serverInfo.validated_ledger?.base_fee_xrp

  if (baseFee == null) {
    throw new XahlError(
      'getFeeXrp: Could not get base_fee_xrp from server_info',
    )
  }

  const baseFeeXrp = new BigNumber(baseFee)
  if (serverInfo.load_factor == null) {
    // https://github.com/xahau/xahaud/issues/3812#issuecomment-816871100
    serverInfo.load_factor = 1
  }
  let fee = baseFeeXrp.times(serverInfo.load_factor).times(feeCushion)

  // Cap fee to `client.maxFeeXAH`
  fee = BigNumber.min(fee, client.maxFeeXAH)
  // Round fee to 6 decimal places
  return new BigNumber(fee.toFixed(NUM_DECIMAL_PLACES)).toString(BASE_10)
}

/**
 * Calculates the estimated transaction fee.
 * Note: This is a public API that can be called directly.
 *
 * @param client - The Client used to connect to the ledger.
 * @param txBlob - The encoded transaction to estimate the fee for.
 * @param signersCount - The number of multisigners.
 * @returns The transaction fee.
 */
export async function getFeeEstimateXrp(
  client: Client,
  txBlob: string,
  signersCount = 0,
): Promise<string> {
  const response = await client.request({
    command: 'fee',
    tx_blob: txBlob,
  })
  const openLedgerFee = response.result.drops.open_ledger_fee
  const noHookFee = response.result.drops.base_fee_no_hooks
  let baseFee = new BigNumber(response.result.drops.base_fee)
  if (signersCount > 0) {
    baseFee = BigNumber.sum(
      openLedgerFee,
      scaleValue(noHookFee, 1 + signersCount),
    )
  }
  return new BigNumber(baseFee.toFixed(NUM_DECIMAL_PLACES)).toString(BASE_10)
}

function scaleValue(value, multiplier): string {
  return new BigNumber(value).times(multiplier).toString()
}

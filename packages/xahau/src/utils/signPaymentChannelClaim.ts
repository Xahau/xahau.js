import { encodeForSigningClaim } from 'xahau-binary-codec'
import { sign } from 'xahau-keypairs'

import { xahToDrops } from './xahConversion'

/**
 * Sign a payment channel claim.
 *
 * @param channel - Channel identifier specified by the paymentChannelClaim.
 * @param xrpAmount - XRP Amount specified by the paymentChannelClaim.
 * @param privateKey - Private Key to sign paymentChannelClaim with.
 * @returns True if the channel is valid.
 * @category Utilities
 */
function signPaymentChannelClaim(
  channel: string,
  xrpAmount: string,
  privateKey: string,
): string {
  const signingData = encodeForSigningClaim({
    channel,
    amount: xahToDrops(xrpAmount),
  })
  return sign(signingData, privateKey)
}

export default signPaymentChannelClaim

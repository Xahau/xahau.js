import { ValidationError } from '../../errors'
import { AmountEntry, MintURIToken } from '../common'
import { isHex } from '../utils'

import { BaseTransaction, validateBaseTransaction } from './common'

const MAX_URI_LENGTH = 512
const DIGEST_LENGTH = 64
const MAX_ARRAY_LENGTH = 32
const MAX_BLOB_LENGTH = 1024

/**
 * A Remit transaction represents a transfer of value from one account to
 * another.
 *
 * @category Transaction Models
 */
export interface Remit extends BaseTransaction {
  TransactionType: 'Remit'
  /** The unique address of the account receiving the payment. */
  Destination: string
  /**
   * Arbitrary tag that identifies the reason for the payment to the
   * destination, or a hosted recipient to pay.
   */
  DestinationTag?: number
  /**
   *
   */
  Amounts?: AmountEntry[]
  /**
   *
   */
  MintURIToken?: MintURIToken
  /**
   *
   */
  URITokenIDs?: string[]
  /**
   * Arbitrary 256-bit hash representing a specific reason or identifier for
   * this payment.
   */
  InvoiceID?: string
  /**
   * Hex value representing a VL Blob.
   */
  Blob?: string
  /** The unique address of the account to inform */
  Inform?: string
}

/**
 * Verify the form and type of a Remit at runtime.
 *
 * @param tx - A Remit Transaction.
 * @throws When the Remit is malformed.
 */
export function validateRemit(tx: Record<string, unknown>): void {
  validateBaseTransaction(tx)

  if (tx.Amounts !== undefined) {
    checkAmounts(tx)
  }
  if (tx.URITokenIDs !== undefined) {
    checkURITokenIDs(tx)
  }
  if (tx.Destination === tx.Account) {
    throw new ValidationError(
      'Remit: Destination must not be equal to the account',
    )
  }
  if (tx.DestinationTag != null && typeof tx.DestinationTag !== 'number') {
    throw new ValidationError('Remit: DestinationTag must be a number')
  }
  if (tx.Inform === tx.Account || tx.Inform === tx.Destination) {
    throw new ValidationError(
      'Remit: Inform must not be equal to the account or destination',
    )
  }

  if (tx.MintURIToken !== undefined) {
    checkMintURIToken(tx)
  }

  if (tx.Blob !== undefined && typeof tx.Blob !== 'string') {
    throw new ValidationError('Remit: Blob must be a string')
  }

  if (tx.Blob !== undefined && typeof tx.Blob === 'string') {
    if (!isHex(tx.Blob)) {
      throw new ValidationError('Remit: Blob must be a hex string')
    }
    if (tx.Blob.length > MAX_BLOB_LENGTH) {
      throw new ValidationError('Remit: max size Blob')
    }
  }
}

function checkAmounts(tx: Record<string, unknown>): void {
  if (!Array.isArray(tx.Amounts)) {
    throw new ValidationError('Remit: Amounts must be an array')
  }
  if (tx.Amounts.length < 1) {
    throw new ValidationError('Remit: empty field Amounts')
  }
  if (tx.Amounts.length > MAX_ARRAY_LENGTH) {
    throw new ValidationError('Remit: max field Amounts')
  }
  const seen = new Set<string>()
  let seenXrp = false
  for (const amount of tx.Amounts) {
    if (
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- ignore
      amount.AmountEntry === undefined ||
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- ignore
      typeof amount.AmountEntry !== 'object'
    ) {
      throw new ValidationError('Remit: invalid Amounts.AmountEntry')
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- ignore
    if (typeof amount.AmountEntry.Amount === 'string') {
      // eslint-disable-next-line max-depth -- ignore
      if (seenXrp) {
        throw new ValidationError(
          'Remit: Duplicate Native amounts are not allowed',
        )
      }
      seenXrp = true
    } else {
      // eslint-disable-next-line max-len -- ignore
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access -- ignore
      const amountKey = `${amount.AmountEntry.Amount.currency}:${amount.AmountEntry.Amount.issuer}`
      // eslint-disable-next-line max-depth -- ingore
      if (seen.has(amountKey)) {
        throw new ValidationError('Remit: Duplicate amounts are not allowed')
      }
      seen.add(amountKey)
    }
  }
}

function checkURITokenIDs(tx: Record<string, unknown>): void {
  if (!Array.isArray(tx.URITokenIDs)) {
    throw new ValidationError('Remit: invalid field URITokenIDs')
  }
  if (tx.URITokenIDs.length < 1) {
    throw new ValidationError('Remit: empty field URITokenIDs')
  }
  if (tx.URITokenIDs.length > MAX_ARRAY_LENGTH) {
    throw new ValidationError('Remit: max field URITokenIDs')
  }
  const seen = new Set<string>()
  for (const token of tx.URITokenIDs) {
    if (typeof token !== 'string' || !isHex(token)) {
      throw new ValidationError('Remit: URITokenID must be a hex string')
    }
    if (token.length !== DIGEST_LENGTH) {
      throw new ValidationError(
        `Remit: URITokenID must be exactly ${DIGEST_LENGTH} characters`,
      )
    }
    if (seen.has(token)) {
      throw new ValidationError('Remit: Duplicate URITokens are not allowed')
    }
    seen.add(token)
  }
}

function checkMintURIToken(tx: Record<string, unknown>): void {
  function isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object'
  }
  if (!isRecord(tx.MintURIToken)) {
    throw new ValidationError('Remit: invalid MintURIToken')
  }
  if (tx.MintURIToken.URI === undefined) {
    throw new ValidationError('Remit: missing field MintURIToken.URI')
  }
  if (typeof tx.MintURIToken.URI !== 'string' || !isHex(tx.MintURIToken.URI)) {
    throw new ValidationError('Remit: MintURIToken.URI must be a hex string')
  }
  if (tx.MintURIToken.URI.length > MAX_URI_LENGTH) {
    throw new ValidationError(
      `Remit: URI must be less than ${MAX_URI_LENGTH} characters`,
    )
  }
  if (
    tx.MintURIToken.Digest !== undefined &&
    typeof tx.MintURIToken.Digest !== 'string'
  ) {
    throw new ValidationError(`Remit: MintURIToken.Digest must be a string`)
  }
  if (
    tx.MintURIToken.Digest !== undefined &&
    !isHex(tx.MintURIToken.Digest) &&
    tx.MintURIToken.Digest.length !== DIGEST_LENGTH
  ) {
    throw new ValidationError(
      `Remit: Digest must be exactly ${DIGEST_LENGTH} characters`,
    )
  }
}

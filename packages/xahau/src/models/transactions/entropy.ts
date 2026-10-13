import { BaseTransaction } from './common'

/**
 * Pseudo-transaction injected by validators that carries their contribution
 * to the consensus random number (RNG amendment). It is never submitted by
 * users.
 *
 * @category Pseudo Transaction Models
 */
export interface Entropy extends BaseTransaction {
  TransactionType: 'Entropy'
  /**
   * The ledger index where this pseudo-transaction appears.
   * This distinguishes the pseudo-transaction from other occurrences of the same change.
   */
  LedgerSequence: number
  /** The validator that submitted this entropy, as identified by its public key. */
  PublicKey: string
  /** The validator's commitment (digest) to the random data it will reveal next. */
  NextRandomDigest: string
  /** The random data the validator committed to previously, revealed now. */
  RandomData?: string
}

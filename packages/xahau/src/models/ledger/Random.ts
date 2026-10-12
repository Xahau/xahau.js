import { BaseLedgerEntry, HasPreviousTxnID } from './BaseLedgerEntry'

interface RandomDigestEntry {
  RandomDigestEntry: {
    PublicKey: string
    NextRandomDigest: string
    LedgerSequence: number
  }
}

/**
 * The singleton `Random` object holds the consensus random number
 * (RNG amendment). It is updated by `Entropy` pseudo-transactions.
 *
 * `RandomData` and `RandomDigests` are never written to metadata nodes.
 * Transaction metadata may carry `RandomData` for transactions whose Hooks
 * drew random numbers.
 *
 * @category Ledger Entries
 */
export default interface Random extends BaseLedgerEntry, HasPreviousTxnID {
  LedgerEntryType: 'Random'
  /** The ledger index of the last update to this object. */
  LedgerSequence: number
  /**
   * The current RNG state. It is reseeded by the Entropy reveals of each
   * ledger and advanced by every Hook draw.
   */
  RandomData: string
  /** The number of validators whose entropy contributed to `RandomData`. */
  EntropyCount: number
  /** The number of validators eligible to contribute entropy (the UNLReport size). */
  EntropyDenominator: number
  /** The digests that validators have committed to for the next round. */
  RandomDigests: RandomDigestEntry[]
}

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
 * @category Ledger Entries
 */
export default interface Random extends BaseLedgerEntry, HasPreviousTxnID {
  LedgerEntryType: 'Random'
  /** The ledger index of the last update to this object. */
  LedgerSequence: number
  /** The current random data, derived from the validators' revealed entropy. */
  RandomData: string
  /** The number of validators whose entropy contributed to `RandomData`. */
  EntropyCount: number
  /** The number of validators that were expected to contribute entropy. */
  EntropyDenominator: number
  /** The digests that validators have committed to for the next round. */
  RandomDigests: RandomDigestEntry[]
}

import { BaseLedgerEntry } from './BaseLedgerEntry'

interface ImportVLKey {
  ImportVLKey: {
    PublicKey: string
    Account?: string
  }
}
interface ActiveValidator {
  ActiveValidator: {
    PublicKey: string
    Account?: string
  }
}

/**
 *
 *
 *
 * @category Ledger Entries
 */
export default interface UNLReport extends BaseLedgerEntry {
  LedgerEntryType: 'UNLReport'
  /**
   *
   */
  ImportVLKeys?: ImportVLKey[]
  /**
   *
   */
  ActiveValidators?: ActiveValidator[]
  /**
   * The identifying hash of the transaction that most recently modified this
   * object.
   */
  PreviousTxnID: string
  /**
   * The index of the ledger that contains the transaction that most recently
   * modified this object.
   */
  PreviousTxnLgrSeq: number
}

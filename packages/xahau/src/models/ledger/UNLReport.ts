import { BaseLedgerEntry, HasPreviousTxnID } from './BaseLedgerEntry'

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
export default interface UNLReport extends BaseLedgerEntry, HasPreviousTxnID {
  LedgerEntryType: 'UNLReport'
  /**
   *
   */
  ImportVLKeys?: ImportVLKey[]
  /**
   *
   */
  ActiveValidators?: ActiveValidator[]
}

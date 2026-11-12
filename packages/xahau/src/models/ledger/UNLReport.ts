import { BaseLedgerEntry, HasPreviousTxnID } from './BaseLedgerEntry'

interface ImportVLKey {
  ImportVLKey: {
    PublicKey: string
    Account?: string
    /** The network this VL key is trusted for (Export amendment). */
    RemoteNetworkID?: number
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
  /**
   * The ledger of the last ActiveValidator/ImportVLKey report, which decides
   * when the arrays above are reset (Export amendment).
   */
  LedgerSequence?: number
  /** Bumped whenever a validator's export key changes (Export amendment). */
  ExportKeysSeq?: number
}

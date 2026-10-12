import { BaseLedgerEntry, HasPreviousTxnID } from './BaseLedgerEntry'

/**
 * The Manifest object type records a validator manifest on the ledger. Two
 * copies are written, one at the keylet of the master public key and one at the
 * keylet of the ephemeral (signing) public key. They are created by the node
 * from a `submit` request with the `manifest` parameter.
 *
 * @category Ledger Entries
 */
export default interface Manifest extends BaseLedgerEntry, HasPreviousTxnID {
  LedgerEntryType: 'Manifest'
  /** The account derived from the master public key. */
  Account: string
  /** The master public key of the validator. */
  PublicKey: string
  /** The ephemeral (signing) public key. */
  SigningPubKey?: string
  /** The sequence number of the manifest. */
  Sequence: number
  /** The version of the manifest format. */
  Version?: number
  /** The domain of the validator, hex encoded. */
  Domain?: string
  /** The signature of the manifest made with the master key. */
  MasterSignature: string
  /** The signature of the manifest made with the ephemeral key. */
  Signature?: string
  /** The ledger index of the master copy of this manifest. */
  ManifestID?: string
  /**
   * A hint indicating which page of the owner directory links to this object.
   * Only present on the master copy.
   */
  OwnerNode?: string
}

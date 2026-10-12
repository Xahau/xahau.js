import { BaseTransaction } from './common'

/**
 * Records a validator manifest on the ledger.
 *
 * This pseudo-transaction is never built by clients. The node builds it from a
 * `submit` request that carries the `manifest` parameter. It has no account
 * signature (`SigningPubKey` and `TxnSignature` are present but empty),
 * `Sequence` is always 0 and `Account` is derived from the manifest's master
 * public key.
 *
 * @category Pseudo Transaction Models
 */
export interface SetManifest extends BaseTransaction {
  TransactionType: 'SetManifest'
  /** The parsed validator manifest. */
  Manifest: {
    /** The master public key of the validator. */
    PublicKey: string
    /** The ephemeral (signing) public key. Absent when the manifest revokes the master key. */
    SigningPubKey?: string
    /** The sequence number of the manifest. */
    Sequence: number
    /** The signature of the manifest made with the master key. */
    MasterSignature: string
    /** The signature of the manifest made with the ephemeral key. */
    Signature?: string
    /** The version of the manifest format. */
    Version?: number
    /** The domain of the validator, hex encoded. */
    Domain?: string
  }
}

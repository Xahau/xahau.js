import { Amount } from '.'

/**
 * Enum representing values for Hook Flags for SetHook Transaction.
 *
 * @category Transaction Flags
 */
export enum HookFlags {
  /**
   */
  hsfOverride = 0x00000001,
  /**
   */
  hsfNSDelete = 0x0000002,
  /**
   */
  hsfCollect = 0x00000004,
}

export interface HookFlagsInterface {
  hsfOverride?: boolean
  hsfNSDelete?: boolean
  hsfCollect?: boolean
}

export interface AmountEntry {
  AmountEntry: { Amount: Amount }
}

/**
 * The object that describes the grant in HookGrants.
 */
export interface HookGrant {
  /**
   * The object that describes the grant in HookGrants.
   */
  HookGrant: {
    /**
     * The hook hash of the grant.
     */
    HookHash: string
    /**
     * The account authorized on the grant.
     */
    Authorize?: string
  }
}

/**
 * The object that describes the parameter in HookParameters.
 */
export interface HookParameter {
  /**
   * The object that describes the parameter in HookParameters.
   */
  HookParameter: {
    /**
     * The name of the parameter.
     */
    HookParameterName: string
    /**
     * The value of the parameter.
     */
    HookParameterValue?: string
  }
}

/**
 * The object that describes the hook in Hooks.
 */
export interface Hook {
  /**
   * The object that describes the hook in Hooks.
   */
  Hook: {
    HookHash?: string
    /**
     * The code that is executed when the hook is triggered.
     */
    CreateCode?: string
    /**
     * The flags that are set on the hook.
     */
    Flags?: number | HookFlagsInterface
    /**
     * The transactions that triggers the hook. Represented as a 256Hash
     */
    HookOn?: string
    /**
     * The incoming transactions that triggers to the hook. Represented as a 256Hash
     */
    HookOnIncoming?: string
    /**
     * The outgoing transactions that triggers from the hook. Represented as a 256Hash
     */
    HookOnOutgoing?: string
    /**
     * The transactions that can emit from the hook. Represented as a 256Hash
     */
    HookCanEmit?: string
    /**
     * The namespace of the hook.
     */
    HookNamespace?: string
    /**
     * The API version of the hook.
     */
    HookApiVersion?: number
    /**
     * The parameters of the hook.
     */
    HookParameters?: HookParameter[]
    /**
     * The grants of the hook.
     */
    HookGrants?: HookGrant[]
  }
}

/**
 * This information is added to emitted Transactions.
 */
export interface EmitDetails {
  EmitBurden: number
  EmitGeneration: number
  EmitHookHash: string
  EmitParentTxnID: string
  sfEmitNonce: string
  sfEmitCallback?: string
}

export enum MintURITokenFlags {
  tfBurnable = 0x00000001,
}

export interface MintURITokenFlagsInterface {
  tfBurnable?: boolean
}

/**
 * The object that describes the uritoken in MintURIToken.
 */
export interface MintURIToken {
  /**
   *
   */
  URI: string
  /**
   *
   */
  Digest?: string
  /**
   * The flags that are set on the uritoken.
   */
  Flags?: number | MintURITokenFlagsInterface
}

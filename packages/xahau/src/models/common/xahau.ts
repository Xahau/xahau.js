import { Amount } from '.'

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
 * The object that describes the function in HookFunctions.
 */
export interface HookFunction {
  /**
   * The object that describes the function in HookFunctions.
   */
  HookFunction: {
    /**
     * The name of the function.
     */
    FunctionName: string
    /**
     * The flags of the function.
     */
    Flags?: number
    /**
     * The parameters of the function.
     */
    FunctionParameters: FunctionParameter[]
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
 * The object that describes the parameter in FunctionParameters.
 */
export interface FunctionParameter {
  /**
   * The object that describes the parameter in FunctionParameters.
   */
  FunctionParameter: {
    /**
     * The name of the parameter.
     */
    FunctionParameterName?: string
    /**
     * The type of the parameter.
     */
    FunctionParameterType?: {
      type: string
    }
    /**
     * The value of the parameter.
     */
    FunctionParameterValue?: {
      type: string
      value: number | string | Amount
    }
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
    Flags?: number
    /**
     * The transactions that triggers the hook. Represented as a 256Hash
     */
    HookOn?: string
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
    /**
     * The functions of the hook.
     */
    HookFunctions?: HookFunction[]
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
  Flags?: number
}

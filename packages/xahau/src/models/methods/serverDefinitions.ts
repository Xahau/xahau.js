import { BaseRequest, BaseResponse } from './baseMethod'

/**
 * The `server_definitions` method retrieves information about the definition
 * enums available in this xahaud node. Expects a response in the form of a
 * {@link ServerDefinitionsResponse}.
 *
 * @category Requests
 */
export interface ServerDefinitionsRequest extends BaseRequest {
  command: 'server_definitions'
  /**
   * The hash of a `server_definitions` response.
   */
  hash?: string
}

/**
 * A Hook API function definition.
 */
export interface ServerDefinitionsHookApi {
  /** The C return type of the function. */
  return: string
  /** The name and C type of each parameter of the function. */
  params: Array<{ type: string; name: string }>
  /** The amendment that enables the function. Only present for amendment-gated functions. */
  amendment?: string
}

/**
 * The state of an amendment as reported by `server_definitions`.
 */
export interface ServerDefinitionsFeature {
  /** Whether the amendment is active on this server, including amendments forced on by configuration. */
  enabled: boolean
  /** Whether the amendment is active on the ledger. */
  ledger_enabled: boolean
  /** The name of the amendment. */
  name: string
  /**
   * Whether this server supports the amendment. Omitted for amendments forced
   * on by configuration that this server does not support.
   */
  supported?: boolean
  /**
   * Whether this server votes against the amendment. `'Obsolete'` for retired
   * amendments. Omitted for amendments forced on by configuration that this
   * server does not support.
   */
  vetoed?: boolean | 'Obsolete'
}

/**
 * Response expected from an {@link ServerDefinitionsRequest}.
 *
 * @category Responses
 */
export interface ServerDefinitionsResponse extends BaseResponse {
  result: {
    hash: string
  } & (
    | {
        FIELDS: Array<
          [
            string,
            {
              nth: number
              isVLEncoded: boolean
              isSerialized: boolean
              isSigningField: boolean
              type: string
            },
          ]
        >

        LEDGER_ENTRY_TYPES: Record<string, number>

        TRANSACTION_RESULTS: Record<string, number>

        TRANSACTION_FLAGS: Record<string, Record<string, number>>

        TRANSACTION_FLAGS_INDICES: Record<string, Record<string, number>>

        TRANSACTION_TYPES: Record<string, number>

        TYPES: Record<string, number>

        /** The amendments known to this server, keyed by amendment ID. */
        features: Record<string, ServerDefinitionsFeature>

        /** The code of the native currency. */
        native_currency_code: string

        /** Definitions for the Hook API. */
        HOOK: {
          /** The Hook API functions, keyed by name. */
          API: Record<string, ServerDefinitionsHookApi>
          KEYLET_TYPES: Record<string, number>
          RETURN_CODES: Record<string, number>
        }
      }
    | {
        FIELDS?: never

        LEDGER_ENTRY_TYPES?: never

        TRANSACTION_RESULTS?: never

        TRANSACTION_FLAGS?: never

        TRANSACTION_FLAGS_INDICES?: never

        TRANSACTION_TYPES?: never

        TYPES?: never

        features?: never

        native_currency_code?: never

        HOOK?: never
      }
  )
}

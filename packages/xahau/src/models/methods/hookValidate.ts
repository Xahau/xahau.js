import { BaseRequest, BaseResponse } from './baseMethod'

/**
 * The `hook_validate` command checks whether a hook's WebAssembly code is valid
 * and reports its worst-case instruction counts. Returns a
 * {@link HookValidateResponse}.
 *
 * Availability is controlled by the `[hook_validate_rpc]` config section. It is
 * off by default on networked nodes and on in standalone mode. When disabled,
 * the server returns a `notSupported` error.
 *
 * @category Requests
 */
export interface HookValidateRequest extends BaseRequest {
  command: 'hook_validate'
  /**
   * The hook WebAssembly code, as an even-length hex string. Must not be larger
   * than the maximum hook size.
   */
  code: string
}

/**
 * Response expected from a {@link HookValidateRequest}.
 *
 * @category Responses
 */
export interface HookValidateResponse extends BaseResponse {
  result: {
    /** Whether the hook code passed validation. */
    valid: boolean
    /** The worst-case instruction count of the hook function. Only present if valid. */
    instruction_count_hook?: string
    /** The worst-case instruction count of the cbak function. Only present if valid. */
    instruction_count_cbak?: string
    /** Messages produced during validation. */
    log: string[]
    /** The error reported by the VM. Only present if guard checking passed but the VM rejected the module. */
    vm_error?: string
  }
}

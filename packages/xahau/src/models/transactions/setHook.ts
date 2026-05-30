import { ValidationError } from '../../errors'
import { Hook } from '../common/xahau'

import { BaseTransaction, validateBaseTransaction } from './common'

/**
 *
 *
 * @category Transaction Models
 */
export interface SetHook extends BaseTransaction {
  TransactionType: 'SetHook'
  /**
   *
   */
  Hooks: Hook[]
}

const MAX_HOOKS = 10
const HEX_REGEX = /^[0-9A-Fa-f]{64}$/u
/**
 * 4-16 bytes in hex
 */
const HOOKNAME_REGEX = /^[0-9A-Fa-f]{8,32}$/u

/**
 * Verify the form and type of an SetHook at runtime.
 *
 * @param tx - An SetHook Transaction.
 * @throws When the SetHook is Malformed.
 */
// eslint-disable-next-line max-lines-per-function -- okay for this method
export function validateSetHook(tx: Record<string, unknown>): void {
  validateBaseTransaction(tx)

  if (!Array.isArray(tx.Hooks)) {
    throw new ValidationError('SetHook: invalid Hooks')
  }

  if (tx.Hooks.length > MAX_HOOKS) {
    throw new ValidationError(
      `SetHook: maximum of ${MAX_HOOKS} hooks allowed in Hooks`,
    )
  }

  for (const hook of tx.Hooks) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Should be a Hook
    const hookObject = hook as Hook
    const {
      HookOn,
      HookOnIncoming,
      HookOnOutgoing,
      HookCanEmit,
      HookNamespace,
      HookName
    } = hookObject.Hook
    if (HookOn !== undefined && !HEX_REGEX.test(HookOn)) {
      throw new ValidationError(
        `SetHook: HookOn in Hook must be a 256-bit (32-byte) hexadecimal value`,
      )
    }
    if (HookOnIncoming !== undefined && !HEX_REGEX.test(HookOnIncoming)) {
      throw new ValidationError(
        `SetHook: HookOnIncoming in Hook must be a 256-bit (32-byte) hexadecimal value`,
      )
    }
    if (HookOnOutgoing !== undefined && !HEX_REGEX.test(HookOnOutgoing)) {
      throw new ValidationError(
        `SetHook: HookOnOutgoing in Hook must be a 256-bit (32-byte) hexadecimal value`,
      )
    }
    if (HookCanEmit !== undefined && !HEX_REGEX.test(HookCanEmit)) {
      throw new ValidationError(
        `SetHook: HookCanEmit in Hook must be a 256-bit (32-byte) hexadecimal value`,
      )
    }
    if (HookNamespace !== undefined && !HEX_REGEX.test(HookNamespace)) {
      throw new ValidationError(
        `SetHook: HookNamespace in Hook must be a 256-bit (32-byte) hexadecimal value`,
      )
    }
    if (HookName !== undefined && !HOOKNAME_REGEX.test(HookName)) {
      throw new ValidationError(
        `SetHook: HookName in Hook must be a hex string of 8-32 hex characters`,
      )
    }
  }
}

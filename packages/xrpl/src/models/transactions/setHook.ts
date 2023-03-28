import { ValidationError } from '../../errors'
import { Hook } from '../common'

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

const MAX_HOOKS = 4
const HEX_REGEX = /^[0-9A-Fa-f]{64}$/u

/**
 * Verify the form and type of an SetHook at runtime.
 *
 * @param tx - An SetHook Transaction.
 * @throws When the SetHook is Malformed.
 */
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
    const { HookOn, HookNamespace } = hookObject.Hook
    if (HookOn !== undefined && !HEX_REGEX.test(HookOn)) {
      throw new ValidationError(
        `SetHook: HookOn in Hook must be a 256-bit (32-byte) hexadecimal value`,
      )
    }
    if (HookNamespace !== undefined && !HEX_REGEX.test(HookNamespace)) {
      throw new ValidationError(
        `SetHook: HookNamespace in Hook must be a 256-bit (32-byte) hexadecimal value`,
      )
    }
  }
}

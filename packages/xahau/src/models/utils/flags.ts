/* eslint-disable no-param-reassign -- param reassign is safe */
/* eslint-disable no-bitwise -- flags require bitwise operations */
import { ValidationError } from '../../errors'
import { Hook, HookFlags, MintURITokenFlags } from '../common/xahau'
import {
  AccountRootFlagsInterface,
  AccountRootFlags,
} from '../ledger/AccountRoot'
import { AccountSetTfFlags } from '../transactions/accountSet'
import { GlobalFlags } from '../transactions/common'
import { CronSetFlags } from '../transactions/cronSet'
import { OfferCreateFlags } from '../transactions/offerCreate'
import { PaymentFlags } from '../transactions/payment'
import { PaymentChannelClaimFlags } from '../transactions/paymentChannelClaim'
import { RemarkFlags, Remark } from '../transactions/setRemarks'
import type { Transaction } from '../transactions/transaction'
import { TrustSetFlags } from '../transactions/trustSet'

import { isFlagEnabled } from '.'

/**
 * Convert an AccountRoot Flags number into an interface for easy interpretation.
 *
 * @param flags - A number which is the bitwise and of all enabled AccountRootFlagsInterface.
 * @returns An interface with all flags as booleans.
 */
export function parseAccountRootFlags(
  flags: number,
): AccountRootFlagsInterface {
  const flagsInterface: AccountRootFlagsInterface = {}

  // If we use keys all will be strings and enums are reversed during transpilation
  Object.values(AccountRootFlags).forEach((flag) => {
    if (
      typeof flag === 'string' &&
      isFlagEnabled(flags, AccountRootFlags[flag])
    ) {
      flagsInterface[flag] = true
    }
  })

  return flagsInterface
}

const txToFlag = {
  AccountSet: AccountSetTfFlags,
  OfferCreate: OfferCreateFlags,
  PaymentChannelClaim: PaymentChannelClaimFlags,
  Payment: PaymentFlags,
  TrustSet: TrustSetFlags,
  CronSet: CronSetFlags,
}

/**
 * Sets a transaction's flags to its numeric representation.
 *
 * @param tx - A transaction to set its flags to its numeric representation.
 */
export function setTransactionFlagsToNumber(tx: Transaction): void {
  if (tx.TransactionType === 'SetHook' && Array.isArray(tx.Hooks)) {
    tx.Hooks.forEach((hook: Hook) => {
      if (typeof hook.Hook.Flags === 'object') {
        hook.Hook.Flags = convertFlagsToNumber(hook.Hook.Flags, HookFlags)
      }
    })
  }

  if (tx.TransactionType === 'Remit') {
    if (tx.MintURIToken != null && typeof tx.MintURIToken.Flags === 'object') {
      tx.MintURIToken.Flags = convertFlagsToNumber(
        tx.MintURIToken.Flags,
        MintURITokenFlags,
      )
    }
  }

  if (tx.TransactionType === 'SetRemarks') {
    if (Array.isArray(tx.Remarks)) {
      tx.Remarks.forEach((remark: Remark) => {
        if (typeof remark.Remark.Flags === 'object') {
          remark.Remark.Flags = convertFlagsToNumber(
            remark.Remark.Flags,
            RemarkFlags,
          )
        }
      })
    }
  }

  if (tx.Flags == null) {
    tx.Flags = 0
    return
  }
  if (typeof tx.Flags === 'number') {
    return
  }

  tx.Flags = txToFlag[tx.TransactionType]
    ? convertFlagsToNumber(tx.Flags, txToFlag[tx.TransactionType])
    : 0
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- added ValidationError check for flagEnum
function convertFlagsToNumber(flags: GlobalFlags, flagEnum: any): number {
  return Object.keys(flags).reduce((resultFlags, flag) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- safe member access
    if (flagEnum[flag] == null) {
      throw new ValidationError(
        `flag ${flag} doesn't exist in flagEnum: ${JSON.stringify(flagEnum)}`,
      )
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- safe member access
    return flags[flag] ? resultFlags | flagEnum[flag] : resultFlags
  }, 0)
}

/**
 * Convert a Transaction flags property into a map for easy interpretation.
 *
 * @param tx - A transaction to parse flags for.
 * @returns A map with all flags as booleans.
 */
export function parseTransactionFlags(tx: Transaction): object {
  setTransactionFlagsToNumber(tx)
  if (typeof tx.Flags !== 'number' || !tx.Flags || tx.Flags === 0) {
    return {}
  }

  const flags = tx.Flags
  const flagsMap = {}

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- safe member access
  const flagEnum = txToFlag[tx.TransactionType]
  Object.values(flagEnum).forEach((flag) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- safe member access
    if (typeof flag === 'string' && isFlagEnabled(flags, flagEnum[flag])) {
      flagsMap[flag] = true
    }
  })

  return flagsMap
}

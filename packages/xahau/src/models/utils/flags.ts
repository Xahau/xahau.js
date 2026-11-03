/* eslint-disable no-bitwise -- flags require bitwise operations */
import { ValidationError } from '../../errors'
import { Hook, HookFlags, MintURITokenFlags } from '../common/xahau'
import {
  AccountRootFlagsInterface,
  AccountRootFlags,
} from '../ledger/AccountRoot'
import { AccountSetTfFlags } from '../transactions/accountSet'
import { ClaimRewardFlags } from '../transactions/claimReward'
import { GlobalFlags } from '../transactions/common'
import { CronSetFlags } from '../transactions/cronSet'
import { OfferCreateFlags } from '../transactions/offerCreate'
import { PaymentFlags } from '../transactions/payment'
import { PaymentChannelClaimFlags } from '../transactions/paymentChannelClaim'
import { RemarkFlags, Remark } from '../transactions/setRemarks'
import type { Transaction } from '../transactions/transaction'
import { TrustSetFlags } from '../transactions/trustSet'
import { URITokenMintFlags } from '../transactions/uriTokenMint'

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
  URITokenMint: URITokenMintFlags,
  ClaimReward: ClaimRewardFlags,
  CronSet: CronSetFlags,
}

function isTxToFlagKey(
  transactionType: string,
): transactionType is keyof typeof txToFlag {
  return transactionType in txToFlag
}

/* eslint-disable no-param-reassign -- nested flags are converted in place */
/**
 * Sets the flags of Xahau-specific nested objects (`Hook`, `MintURIToken`, `Remark`)
 * to their numeric representation. The nested objects are modified in place.
 *
 * @param tx - A transaction whose nested flags should be converted.
 */
export function setNestedFlagsToNumber(tx: Transaction): void {
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
}
/* eslint-enable no-param-reassign */

/**
 * Sets a transaction's flags to its numeric representation.
 *
 * @deprecated
 * This utility function is deprecated.
 * Use convertTxFlagsToNumber() instead and use the returned value to modify the Transaction.Flags from the caller.
 *
 * @param tx - A transaction to set its flags to its numeric representation.
 */
export function setTransactionFlagsToNumber(tx: Transaction): void {
  // eslint-disable-next-line no-console -- intended deprecation warning
  console.warn(
    'This function is deprecated. Use convertTxFlagsToNumber() instead and use the returned value to modify the Transaction.Flags from the caller.',
  )
  setNestedFlagsToNumber(tx)

  if (tx.Flags) {
    // eslint-disable-next-line no-param-reassign -- intended param reassign in setter, retain old functionality for compatibility
    tx.Flags = convertTxFlagsToNumber(tx)
  }
}

/**
 * Returns a Transaction's Flags as its numeric representation.
 *
 * @param tx - A Transaction to parse Flags for
 * @returns A numerical representation of a Transaction's Flags
 */
export function convertTxFlagsToNumber(tx: Transaction): number {
  if (!tx.Flags) {
    return 0
  }
  if (typeof tx.Flags === 'number') {
    return tx.Flags
  }

  if (isTxToFlagKey(tx.TransactionType)) {
    return convertFlagsToNumber(tx.Flags, txToFlag[tx.TransactionType])
  }

  return 0
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- added ValidationError check for flagEnum
function convertFlagsToNumber(flags: GlobalFlags, flagEnum: any): number {
  return Object.keys(flags).reduce((resultFlags, flag) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- safe member access
    if (flagEnum[flag] == null) {
      throw new ValidationError(
        `Invalid flag ${flag}. Valid flags are ${JSON.stringify(flagEnum)}`,
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
  const flags = convertTxFlagsToNumber(tx)
  if (flags === 0) {
    return {}
  }

  const booleanFlagMap = {}

  if (isTxToFlagKey(tx.TransactionType)) {
    const transactionTypeFlags = txToFlag[tx.TransactionType]
    Object.values(transactionTypeFlags).forEach((flag) => {
      if (
        typeof flag === 'string' &&
        isFlagEnabled(flags, transactionTypeFlags[flag])
      ) {
        booleanFlagMap[flag] = true
      }
    })
  }

  return booleanFlagMap
}

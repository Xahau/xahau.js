/* eslint-disable max-lines -- need to work with a lot of transactions in a switch statement */
/* eslint-disable max-lines-per-function -- need to work with a lot of Tx verifications */

import { ValidationError } from '../../errors'
import { IssuedCurrencyAmount, Memo } from '../common'
import { isHex } from '../utils'
import { setTransactionFlagsToNumber } from '../utils/flags'

import { AccountDelete, validateAccountDelete } from './accountDelete'
import { AccountSet, validateAccountSet } from './accountSet'
import { AMMBid, validateAMMBid } from './AMMBid'
import { AMMCreate, validateAMMCreate } from './AMMCreate'
import { AMMDelete, validateAMMDelete } from './AMMDelete'
import { AMMDeposit, validateAMMDeposit } from './AMMDeposit'
import { AMMVote, validateAMMVote } from './AMMVote'
import { AMMWithdraw, validateAMMWithdraw } from './AMMWithdraw'
import { CheckCancel, validateCheckCancel } from './checkCancel'
import { CheckCash, validateCheckCash } from './checkCash'
import { CheckCreate, validateCheckCreate } from './checkCreate'
import { ClaimReward, validateClaimReward } from './claimReward'
import { Clawback, validateClawback } from './clawback'
import { BaseTransaction, isIssuedCurrency } from './common'
import { DepositPreauth, validateDepositPreauth } from './depositPreauth'
import { DIDDelete, validateDIDDelete } from './DIDDelete'
import { DIDSet, validateDIDSet } from './DIDSet'
import { EnableAmendment } from './enableAmendment'
import { EscrowCancel, validateEscrowCancel } from './escrowCancel'
import { EscrowCreate, validateEscrowCreate } from './escrowCreate'
import { EscrowFinish, validateEscrowFinish } from './escrowFinish'
import { Import, validateImport } from './import'
import { Invoke, validateInvoke } from './invoke'
import { TransactionMetadata } from './metadata'
import {
  NFTokenAcceptOffer,
  validateNFTokenAcceptOffer,
} from './NFTokenAcceptOffer'
import { NFTokenBurn, validateNFTokenBurn } from './NFTokenBurn'
import {
  NFTokenCancelOffer,
  validateNFTokenCancelOffer,
} from './NFTokenCancelOffer'
import {
  NFTokenCreateOffer,
  validateNFTokenCreateOffer,
} from './NFTokenCreateOffer'
import { NFTokenMint, validateNFTokenMint } from './NFTokenMint'
import { OfferCancel, validateOfferCancel } from './offerCancel'
import { OfferCreate, validateOfferCreate } from './offerCreate'
import { OracleDelete, validateOracleDelete } from './oracleDelete'
import { OracleSet, validateOracleSet } from './oracleSet'
import { Payment, validatePayment } from './payment'
import {
  PaymentChannelClaim,
  validatePaymentChannelClaim,
} from './paymentChannelClaim'
import {
  PaymentChannelCreate,
  validatePaymentChannelCreate,
} from './paymentChannelCreate'
import {
  PaymentChannelFund,
  validatePaymentChannelFund,
} from './paymentChannelFund'
import { Remit, validateRemit } from './remit'
import { SetFee } from './setFee'
import { SetHook, validateSetHook } from './setHook'
import { SetRegularKey, validateSetRegularKey } from './setRegularKey'
import { SignerListSet, validateSignerListSet } from './signerListSet'
import { TicketCreate, validateTicketCreate } from './ticketCreate'
import { TrustSet, validateTrustSet } from './trustSet'
import { UNLModify } from './UNLModify'
import { URITokenBurn, validateURITokenBurn } from './uriTokenBurn'
import { URITokenBuy, validateURITokenBuy } from './uriTokenBuy'
import {
  URITokenCancelSellOffer,
  validateURITokenCancelSellOffer,
} from './uriTokenCancelSellOffer'
import {
  URITokenCreateSellOffer,
  validateURITokenCreateSellOffer,
} from './uriTokenCreateSellOffer'
import { URITokenMint, validateURITokenMint } from './uriTokenMint'
import {
  XChainAccountCreateCommit,
  validateXChainAccountCreateCommit,
} from './XChainAccountCreateCommit'
import {
  XChainAddAccountCreateAttestation,
  validateXChainAddAccountCreateAttestation,
} from './XChainAddAccountCreateAttestation'
import {
  XChainAddClaimAttestation,
  validateXChainAddClaimAttestation,
} from './XChainAddClaimAttestation'
import { XChainClaim, validateXChainClaim } from './XChainClaim'
import { XChainCommit, validateXChainCommit } from './XChainCommit'
import {
  XChainCreateBridge,
  validateXChainCreateBridge,
} from './XChainCreateBridge'
import {
  XChainCreateClaimID,
  validateXChainCreateClaimID,
} from './XChainCreateClaimID'
import {
  XChainModifyBridge,
  validateXChainModifyBridge,
} from './XChainModifyBridge'

/**
 * Transactions that can be submitted by clients
 *
 * @category Transaction Models
 */
export type SubmittableTransaction =
  | AMMBid
  | AMMCreate
  | AMMDelete
  | AMMDeposit
  | AMMVote
  | AMMWithdraw
  | AccountDelete
  | AccountSet
  | CheckCancel
  | CheckCash
  | CheckCreate
  | ClaimReward
  | Clawback
  | DIDDelete
  | DIDSet
  | DepositPreauth
  | EscrowCancel
  | EscrowCreate
  | EscrowFinish
  | Import
  | Invoke
  | NFTokenAcceptOffer
  | NFTokenBurn
  | NFTokenCancelOffer
  | NFTokenCreateOffer
  | NFTokenMint
  | OfferCancel
  | OfferCreate
  | OracleDelete
  | OracleSet
  | Payment
  | PaymentChannelClaim
  | PaymentChannelCreate
  | PaymentChannelFund
  | Remit
  | SetHook
  | SetRegularKey
  | SignerListSet
  | TicketCreate
  | TrustSet
  | URITokenBurn
  | URITokenBuy
  | URITokenCancelSellOffer
  | URITokenMint
  | URITokenCreateSellOffer
  | XChainAccountCreateCommit
  | XChainAddAccountCreateAttestation
  | XChainAddClaimAttestation
  | XChainClaim
  | XChainCommit
  | XChainCreateBridge
  | XChainCreateClaimID
  | XChainModifyBridge

/**
 * Transactions that can only be created by validators.
 *
 * @category Transaction Models
 */
export type PseudoTransaction = EnableAmendment | SetFee | UNLModify

/**
 * All transactions that can live on the XRPL
 *
 * @category Transaction Models
 */
export type Transaction = SubmittableTransaction | PseudoTransaction

/**
 * @category Transaction Models
 */
export interface TransactionAndMetadata<
  T extends BaseTransaction = Transaction,
> {
  transaction: T
  metadata: TransactionMetadata<T>
}

/**
 * Verifies various Transaction Types.
 * Encode/decode and individual type validation.
 *
 * @param transaction - A Transaction.
 * @throws ValidationError When the Transaction is malformed.
 * @category Utilities
 */
export function validate(transaction: Record<string, unknown>): void {
  const tx = { ...transaction }
  if (tx.TransactionType == null) {
    throw new ValidationError('Object does not have a `TransactionType`')
  }
  if (typeof tx.TransactionType !== 'string') {
    throw new ValidationError("Object's `TransactionType` is not a string")
  }

  /*
   * - Memos have exclusively hex data.
   */
  if (tx.Memos != null && typeof tx.Memos !== 'object') {
    throw new ValidationError('Memo must be array')
  }
  if (tx.Memos != null) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- needed here
    ;(tx.Memos as Array<Memo | null>).forEach((memo) => {
      if (memo?.Memo == null) {
        throw new ValidationError('Memo data must be in a `Memo` field')
      }
      if (memo.Memo.MemoData) {
        if (!isHex(memo.Memo.MemoData)) {
          throw new ValidationError('MemoData field must be a hex value')
        }
      }

      if (memo.Memo.MemoType) {
        if (!isHex(memo.Memo.MemoType)) {
          throw new ValidationError('MemoType field must be a hex value')
        }
      }

      if (memo.Memo.MemoFormat) {
        if (!isHex(memo.Memo.MemoFormat)) {
          throw new ValidationError('MemoFormat field must be a hex value')
        }
      }
    })
  }

  Object.keys(tx).forEach((key) => {
    const standard_currency_code_len = 3
    if (tx[key] && isIssuedCurrency(tx[key])) {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- needed
      const txCurrency = (tx[key] as IssuedCurrencyAmount).currency

      if (
        txCurrency.length === standard_currency_code_len &&
        txCurrency.toUpperCase() === 'XAH'
      ) {
        throw new ValidationError(
          `Cannot have an issued currency with a similar standard code to XAH (received '${txCurrency}'). XAH is not an issued currency.`,
        )
      }
    }
  })

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- okay here
  setTransactionFlagsToNumber(tx as unknown as Transaction)
  switch (tx.TransactionType) {
    case 'AMMBid':
      validateAMMBid(tx)
      break

    case 'AMMCreate':
      validateAMMCreate(tx)
      break

    case 'AMMDelete':
      validateAMMDelete(tx)
      break

    case 'AMMDeposit':
      validateAMMDeposit(tx)
      break

    case 'AMMVote':
      validateAMMVote(tx)
      break

    case 'AMMWithdraw':
      validateAMMWithdraw(tx)
      break

    case 'AccountDelete':
      validateAccountDelete(tx)
      break

    case 'AccountSet':
      validateAccountSet(tx)
      break

    case 'CheckCancel':
      validateCheckCancel(tx)
      break

    case 'CheckCash':
      validateCheckCash(tx)
      break

    case 'CheckCreate':
      validateCheckCreate(tx)
      break

    case 'ClaimReward':
      validateClaimReward(tx)
      break

    case 'Clawback':
      validateClawback(tx)
      break

    case 'DIDDelete':
      validateDIDDelete(tx)
      break

    case 'DIDSet':
      validateDIDSet(tx)
      break

    case 'DepositPreauth':
      validateDepositPreauth(tx)
      break

    case 'EscrowCancel':
      validateEscrowCancel(tx)
      break

    case 'EscrowCreate':
      validateEscrowCreate(tx)
      break

    case 'EscrowFinish':
      validateEscrowFinish(tx)
      break

    case 'Import':
      validateImport(tx)
      break

    case 'Invoke':
      validateInvoke(tx)
      break

    case 'NFTokenAcceptOffer':
      validateNFTokenAcceptOffer(tx)
      break

    case 'NFTokenBurn':
      validateNFTokenBurn(tx)
      break

    case 'NFTokenCancelOffer':
      validateNFTokenCancelOffer(tx)
      break

    case 'NFTokenCreateOffer':
      validateNFTokenCreateOffer(tx)
      break

    case 'NFTokenMint':
      validateNFTokenMint(tx)
      break

    case 'OfferCancel':
      validateOfferCancel(tx)
      break

    case 'OfferCreate':
      validateOfferCreate(tx)
      break

    case 'OracleDelete':
      validateOracleDelete(tx)
      break

    case 'OracleSet':
      validateOracleSet(tx)
      break

    case 'Payment':
      validatePayment(tx)
      break

    case 'PaymentChannelClaim':
      validatePaymentChannelClaim(tx)
      break

    case 'PaymentChannelCreate':
      validatePaymentChannelCreate(tx)
      break

    case 'PaymentChannelFund':
      validatePaymentChannelFund(tx)
      break

    case 'Remit':
      validateRemit(tx)
      break

    case 'SetHook':
      validateSetHook(tx)
      break

    case 'SetRegularKey':
      validateSetRegularKey(tx)
      break

    case 'SignerListSet':
      validateSignerListSet(tx)
      break

    case 'TicketCreate':
      validateTicketCreate(tx)
      break

    case 'TrustSet':
      validateTrustSet(tx)
      break

    case 'URITokenMint':
      validateURITokenMint(tx)
      break

    case 'URITokenBurn':
      validateURITokenBurn(tx)
      break

    case 'URITokenCreateSellOffer':
      validateURITokenCreateSellOffer(tx)
      break

    case 'URITokenBuy':
      validateURITokenBuy(tx)
      break

    case 'URITokenCancelSellOffer':
      validateURITokenCancelSellOffer(tx)
      break

    case 'XChainAccountCreateCommit':
      validateXChainAccountCreateCommit(tx)
      break

    case 'XChainAddAccountCreateAttestation':
      validateXChainAddAccountCreateAttestation(tx)
      break

    case 'XChainAddClaimAttestation':
      validateXChainAddClaimAttestation(tx)
      break

    case 'XChainClaim':
      validateXChainClaim(tx)
      break

    case 'XChainCommit':
      validateXChainCommit(tx)
      break

    case 'XChainCreateBridge':
      validateXChainCreateBridge(tx)
      break

    case 'XChainCreateClaimID':
      validateXChainCreateClaimID(tx)
      break

    case 'XChainModifyBridge':
      validateXChainModifyBridge(tx)
      break

    default:
      throw new ValidationError(
        `Invalid field TransactionType: ${tx.TransactionType}`,
      )
  }
}

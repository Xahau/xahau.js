import { xAddressToClassicAddress, isValidXAddress } from 'xahau-address-codec'
import { encode } from 'xahau-binary-codec'

import { type Client } from '..'
import { ValidationError } from '../errors'
import { AccountInfoRequest } from '../models/methods'
import { Transaction } from '../models/transactions'

import { getFeeEstimateXrp } from './getFeeXah'

// Expire unconfirmed transactions after 20 ledger versions, approximately 1 minute, by default
const LEDGER_OFFSET = 20
// Sidechains are expected to have network IDs above this.
// Networks with ID above this restricted number are expected specify an accurate NetworkID field
// in every transaction to that chain to prevent replay attacks.
// Mainnet and testnet are exceptions. More context: https://github.com/XRPLF/xahaud/pull/4370
const RESTRICTED_NETWORKS = 1024

/**
 * Determine if the transaction required a networkID to be valid.
 * Transaction needs networkID if later than restricted ID and build version is >= 1.11.0
 *
 * @param client -- The connected client.
 * @returns True if required networkID, false otherwise.
 */
export function txNeedsNetworkID(client: Client): boolean {
  if (
    client.networkID !== undefined &&
    client.networkID > RESTRICTED_NETWORKS
  ) {
    return true
  }
  return false
}

interface ClassicAccountAndTag {
  classicAccount: string
  tag: number | false | undefined
}

/**
 * Sets valid addresses for the transaction.
 *
 * @param tx - The transaction object.
 */
export function setValidAddresses(tx: Transaction): void {
  validateAccountAddress(tx, 'Account', 'SourceTag')
  // eslint-disable-next-line @typescript-eslint/dot-notation -- Destination can exist on Transaction
  if (tx['Destination'] != null) {
    validateAccountAddress(tx, 'Destination', 'DestinationTag')
  }

  // DepositPreauth:
  convertToClassicAddress(tx, 'Authorize')
  convertToClassicAddress(tx, 'Unauthorize')
  // EscrowCancel, EscrowFinish:
  convertToClassicAddress(tx, 'Owner')
  // SetRegularKey:
  convertToClassicAddress(tx, 'RegularKey')
}

/**
 * Validates the account address in a transaction object.
 *
 * @param tx - The transaction object.
 * @param accountField - The field name for the account address in the transaction object.
 * @param tagField - The field name for the tag in the transaction object.
 * @throws {ValidationError} If the tag field does not match the tag of the account address.
 */
function validateAccountAddress(
  tx: Transaction,
  accountField: string,
  tagField: string,
): void {
  // if X-address is given, convert it to classic address
  const { classicAccount, tag } = getClassicAccountAndTag(tx[accountField])
  // eslint-disable-next-line no-param-reassign -- param reassign is safe
  tx[accountField] = classicAccount

  if (tag != null && tag !== false) {
    if (tx[tagField] && tx[tagField] !== tag) {
      throw new ValidationError(
        `The ${tagField}, if present, must match the tag of the ${accountField} X-address`,
      )
    }
    // eslint-disable-next-line no-param-reassign -- param reassign is safe
    tx[tagField] = tag
  }
}

/**
 * Retrieves the classic account and tag from an account address.
 *
 * @param Account - The account address.
 * @param [expectedTag] - The expected tag for the account address.
 * @returns The classic account and tag.
 * @throws {ValidationError} If the address includes a tag that does not match the tag specified in the transaction.
 */
function getClassicAccountAndTag(
  Account: string,
  expectedTag?: number,
): ClassicAccountAndTag {
  if (isValidXAddress(Account)) {
    const classic = xAddressToClassicAddress(Account)
    if (expectedTag != null && classic.tag !== expectedTag) {
      throw new ValidationError(
        'address includes a tag that does not match the tag specified in the transaction',
      )
    }
    return {
      classicAccount: classic.classicAddress,
      tag: classic.tag,
    }
  }
  return {
    classicAccount: Account,
    tag: expectedTag,
  }
}

/**
 * Converts the specified field of a transaction object to a classic address format.
 *
 * @param tx - The transaction object.
 * @param fieldName - The name of the field to convert.export
 */
function convertToClassicAddress(tx: Transaction, fieldName: string): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- assignment is safe
  const account = tx[fieldName]
  if (typeof account === 'string') {
    const { classicAccount } = getClassicAccountAndTag(account)
    // eslint-disable-next-line no-param-reassign -- param reassign is safe
    tx[fieldName] = classicAccount
  }
}

/**
 * Sets the next valid sequence number for a transaction.
 *
 * @param client - The client object used for making requests.
 * @param tx - The transaction object for which the sequence number needs to be set.
 * @returns A Promise that resolves when the sequence number is set.
 * @throws {Error} If there is an error retrieving the account information.
 */
export async function setNextValidSequenceNumber(
  client: Client,
  tx: Transaction,
): Promise<void> {
  const request: AccountInfoRequest = {
    command: 'account_info',
    account: tx.Account,
    ledger_index: 'current',
  }
  const data = await client.request(request)
  // eslint-disable-next-line no-param-reassign, require-atomic-updates -- param reassign is safe with no race condition
  tx.Sequence = data.result.account_data.Sequence
}

/**
 * Calculates the fee per transaction type.
 *
 * @param client - The client object.
 * @param tx - The transaction object.
 * @param [signersCount=0] - The number of signers (default is 0). Only used for multisigning.
 * @returns A promise that resolves with void. Modifies the `tx` parameter to give it the calculated fee.
 */
export async function calculateFeePerTransactionType(
  client: Client,
  tx: Transaction,
  signersCount = 0,
): Promise<void> {
  const copyTx = { ...tx }
  copyTx.SigningPubKey = ``
  copyTx.Fee = `0`
  const tx_blob = encode(copyTx)
  // eslint-disable-next-line require-atomic-updates, no-param-reassign -- ignore
  tx.Fee = await getFeeEstimateXrp(client, tx_blob, signersCount)
}

/**
 * Sets the latest validated ledger sequence for the transaction.
 *
 * @param client - The client object.
 * @param tx - The transaction object.
 * @returns A promise that resolves with void. Modifies the `tx` parameter setting `LastLedgerSequence`.
 */
export async function setLatestValidatedLedgerSequence(
  client: Client,
  tx: Transaction,
): Promise<void> {
  const ledgerSequence = await client.getLedgerIndex()
  // eslint-disable-next-line no-param-reassign -- param reassign is safe
  tx.LastLedgerSequence = ledgerSequence + LEDGER_OFFSET
}

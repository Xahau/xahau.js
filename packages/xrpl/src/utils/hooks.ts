/**
 * @module tts
 * @description
 * This module contains the transaction types and the function to calculate the hook on
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports -- Required
import createHash = require('create-hash')
import { TRANSACTION_TYPE_MAP, TRANSACTION_TYPES } from 'ripple-binary-codec'

import { XrplError } from '../errors'
import { HookParameter } from '../models/common'

/**
 * @constant tts
 * @description
 * Transaction types
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Required
export const tts = TRANSACTION_TYPE_MAP

/**
 * @typedef TTS
 * @description
 * Transaction types
 */
export type TTS = typeof tts

/**
 * Calculate the hook on
 *
 * @param arr - array of transaction types
 * @returns the hook on
 */
export function calculateHookOn(arr: Array<keyof TTS>): string {
  let hash = '0x3e3ff5bf'
  arr.forEach((nth) => {
    if (typeof nth !== 'string') {
      throw new XrplError(`HookOn transaction type must be string`)
    }
    if (!TRANSACTION_TYPES.includes(String(nth))) {
      throw new XrplError(
        `invalid transaction type '${String(nth)}' in HookOn array`,
      )
    }
    let value = BigInt(hash)
    // eslint-disable-next-line no-bitwise, @typescript-eslint/no-unsafe-member-access -- Required
    value ^= BigInt(1) << BigInt(tts[nth])
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Required
    hash = `0x${value.toString(16)}`
  })
  hash = hash.replace('0x', '')
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Required
  hash = hash.padStart(64, '0')
  return hash.toUpperCase()
}

/**
 * Calculate the sha256 of a string
 *
 * @param string - the string to calculate the sha256
 * @returns the sha256
 */
export async function sha256(string: string): Promise<string> {
  const hash = createHash('sha256')
  hash.update(string)
  const hashBuffer = hash.digest()
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Required
    .map((bytes) => bytes.toString(16).padStart(2, '0'))
    .join('')
  return hashHex
}

/**
 * Calculate the hex of a namespace
 *
 * @param namespace - the namespace to calculate the hex
 * @returns the hex
 */
export async function hexNamespace(namespace: string): Promise<string> {
  return (await sha256(namespace)).toUpperCase()
}

/**
 * Calculate the hex of the hook parameters
 *
 * @param data - the hook parameters
 * @returns the hex of the hook parameters
 */
export function hexHookParameters(data: HookParameter[]): HookParameter[] {
  const hookParameters: HookParameter[] = []
  for (const parameter of data) {
    hookParameters.push({
      HookParameter: {
        HookParameterName: Buffer.from(
          parameter.HookParameter.HookParameterName,
          'utf8',
        )
          .toString('hex')
          .toUpperCase(),
        HookParameterValue: Buffer.from(
          parameter.HookParameter.HookParameterValue,
          'utf8',
        )
          .toString('hex')
          .toUpperCase(),
      },
    })
  }
  return hookParameters
}

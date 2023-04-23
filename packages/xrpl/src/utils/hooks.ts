/**
 * @module tts
 * @description
 * This module contains the transaction types and the function to calculate the hook on
 */

import {
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_MAP,
} from '@transia/ripple-binary-codec'
import createHash = require('create-hash')

import { XrplError } from '../errors'
import { HookParameter } from '../models/common'

/**
 * @constant tts
 * @description
 * Transaction types
 */

/**
 * @typedef TTS
 * @description
 * Transaction types
 */
export type TTS = typeof TRANSACTION_TYPE_MAP

/**
 * Calculate the hook on
 *
 * @param arr - array of transaction types
 * @returns the hook on
 */
export function calculateHookOn(arr: Array<keyof TTS>): string {
  let hash =
    '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffbfffff'
  arr.forEach((nth) => {
    if (typeof nth !== 'string') {
      throw new XrplError(`HookOn transaction type must be string`)
    }
    if (!TRANSACTION_TYPES.includes(String(nth))) {
      throw new XrplError(
        `invalid transaction type '${String(nth)}' in HookOn array`,
      )
    }

    const tts: Record<string, number> = TRANSACTION_TYPE_MAP
    let value = BigInt(hash)
    // eslint-disable-next-line no-bitwise -- Required
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
    let nameValue
    let valueValue
    // eslint-disable-next-line require-unicode-regexp -- Required
    if (/^[0-9a-fA-F]{2,}$/.exec(parameter.HookParameter.HookParameterName)) {
      nameValue = parameter.HookParameter.HookParameterName
    } else {
      nameValue = Buffer.from(parameter.HookParameter.HookParameterName, 'utf8')
        .toString('hex')
        .toUpperCase()
    }
    // eslint-disable-next-line require-unicode-regexp -- Required
    if (/^[0-9a-fA-F]{2,}$/.exec(parameter.HookParameter.HookParameterValue)) {
      valueValue = parameter.HookParameter.HookParameterValue
    } else {
      valueValue = Buffer.from(
        parameter.HookParameter.HookParameterValue,
        'utf8',
      )
        .toString('hex')
        .toUpperCase()
    }
    hookParameters.push({
      HookParameter: {
        HookParameterName: String(nameValue),
        HookParameterValue: String(valueValue),
      },
    })
  }
  return hookParameters
}

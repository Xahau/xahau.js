import { BinaryParser } from '../serdes/binary-parser'

import { AccountID } from './account-id'
import { Blob } from './blob'
import { JSON, JsonObject, SerializedType } from './serialized-type'

import { hexToBytes } from '@xrplf/isomorphic/utils'

import { Amount, AmountObject } from './amount'
import { UInt8 } from './uint-8'
import { UInt16 } from './uint-16'
import { UInt32 } from './uint-32'
import { UInt64 } from './uint-64'
import { Hash128 } from './hash-128'
import { Hash256 } from './hash-256'
import { SERIALIZED_TYPE_ID_MAP } from '../enums'
import { writeUInt16BE } from '../utils'

/**
 * Interface for JSON objects that represent data
 */
interface DataObject extends JsonObject {
  type: string
  value: JSON
}

/**
 * Type guard for DataObject
 */
function isDataObject(arg): arg is DataObject {
  const keys = Object.keys(arg).sort()
  return keys.length === 2 && keys[0] === 'type' && keys[1] === 'value'
}

/**
 * Class for serializing/Deserializing Data
 */
class Data extends SerializedType {
  static defaultData: Data = new Data(hexToBytes('00010000'))

  constructor(bytes: Uint8Array) {
    super(bytes ?? Data.defaultData.bytes)
  }

  /**
   * Construct an data from Data Object
   *
   * @param value An Data
   * @returns An Data object
   */
  // eslint-disable-next-line complexity
  static from<T extends Data | DataObject>(value: T): Data {
    if (value instanceof Data) {
      return value
    }

    if (isDataObject(value)) {
      let innerSerializedTypeID: number
      let innerBytes: Uint8Array
      let variableLengthBytes: Uint8Array | undefined = undefined
      switch (value.type) {
        case 'UINT8': {
          innerSerializedTypeID = SERIALIZED_TYPE_ID_MAP.UInt8
          innerBytes = UInt8.from(value.value as number).toBytes()
          break
        }
        case 'UINT16': {
          innerSerializedTypeID = SERIALIZED_TYPE_ID_MAP.UInt16
          innerBytes = UInt16.from(value.value as number).toBytes()
          break
        }
        case 'UINT32': {
          innerSerializedTypeID = SERIALIZED_TYPE_ID_MAP.UInt32
          innerBytes = UInt32.from(value.value as number).toBytes()
          break
        }
        case 'UINT64': {
          innerSerializedTypeID = SERIALIZED_TYPE_ID_MAP.UInt64
          innerBytes = UInt64.from(value.value as number).toBytes()
          break
        }
        case 'UINT128': {
          innerSerializedTypeID = SERIALIZED_TYPE_ID_MAP.UInt128
          innerBytes = Hash128.from(value.value as string).toBytes()
          break
        }
        case 'UINT256': {
          innerSerializedTypeID = SERIALIZED_TYPE_ID_MAP.UInt256
          innerBytes = Hash256.from(value.value as string).toBytes()
          break
        }
        case 'VL': {
          innerSerializedTypeID = SERIALIZED_TYPE_ID_MAP.Blob
          innerBytes = Blob.from(value.value as string).toBytes()
          variableLengthBytes = this.encodeVariableLength(innerBytes.length)
          break
        }
        case 'ACCOUNT': {
          innerSerializedTypeID = SERIALIZED_TYPE_ID_MAP.AccountID
          innerBytes = AccountID.from(value.value as string).toBytes()
          variableLengthBytes = this.encodeVariableLength(innerBytes.length)
          break
        }
        case 'AMOUNT': {
          innerSerializedTypeID = SERIALIZED_TYPE_ID_MAP.Amount
          innerBytes = Amount.from(
            value.value as AmountObject | string,
          ).toBytes()
          break
        }
        default: {
          throw new Error('Invalid type to construct an Data')
        }
      }

      const bytes = new Uint8Array(2)
      writeUInt16BE(bytes, innerSerializedTypeID, 0)

      if (variableLengthBytes) {
        return new Data(
          Uint8Array.from([...bytes, ...variableLengthBytes, ...innerBytes]),
        )
      }

      return new Data(Uint8Array.from([...bytes, ...innerBytes]))
    }
    throw new Error('Invalid type to construct an Data')
  }

  /**
   * Read an Data from a BinaryParser
   *
   * @param parser BinaryParser to read the Data from
   * @returns An Data object
   */
  static fromParser(parser: BinaryParser): Data {
    const innerSerializedTypeID = parser.readUInt16()

    switch (innerSerializedTypeID) {
      case SERIALIZED_TYPE_ID_MAP.UInt8: {
        return Data.fromUint8Bytes(UInt8.fromParser(parser).toBytes())
      }
      case SERIALIZED_TYPE_ID_MAP.UInt16: {
        return Data.fromUint16Bytes(UInt16.fromParser(parser).toBytes())
      }
      case SERIALIZED_TYPE_ID_MAP.UInt32: {
        return Data.fromUint32Bytes(UInt32.fromParser(parser).toBytes())
      }
      case SERIALIZED_TYPE_ID_MAP.UInt64: {
        return Data.fromUint64Bytes(UInt64.fromParser(parser).toBytes())
      }
      case SERIALIZED_TYPE_ID_MAP.UInt128: {
        return Data.fromUint128Bytes(Hash128.fromParser(parser).toBytes())
      }
      case SERIALIZED_TYPE_ID_MAP.UInt256: {
        return Data.fromUint256Bytes(Hash256.fromParser(parser).toBytes())
      }
      case SERIALIZED_TYPE_ID_MAP.Amount: {
        return Data.fromAmountBytes(Amount.fromParser(parser).toBytes())
      }
      case SERIALIZED_TYPE_ID_MAP.Blob: {
        // TODO: Check if this is correct
        return Data.fromBlobBytes(
          Blob.fromParser(parser, parser.readVariableLengthLength()).toBytes(),
        )
      }
      case SERIALIZED_TYPE_ID_MAP.AccountID: {
        parser.skip(1)
        return Data.fromAccountIDBytes(AccountID.fromParser(parser).toBytes())
      }
      default: {
        throw new Error('Invalid type to construct an Data')
      }
    }
  }

  /**
   * Get the JSON representation of this Amount
   *
   * @returns the JSON interpretation of this.bytes
   */
  toJSON(): DataObject {
    const parser = new BinaryParser(this.toString())
    const innerSerializedTypeID = parser.readUInt16()

    switch (innerSerializedTypeID) {
      case SERIALIZED_TYPE_ID_MAP.UInt8: {
        return {
          type: 'UINT8',
          value: UInt8.fromParser(parser).toJSON(),
        }
      }
      case SERIALIZED_TYPE_ID_MAP.UInt16: {
        return {
          type: 'UINT16',
          value: UInt16.fromParser(parser).toJSON(),
        }
      }
      case SERIALIZED_TYPE_ID_MAP.UInt32: {
        return {
          type: 'UINT32',
          value: UInt32.fromParser(parser).toJSON(),
        }
      }
      case SERIALIZED_TYPE_ID_MAP.UInt64: {
        return {
          type: 'UINT64',
          value: UInt64.fromParser(parser).toJSON(),
        }
      }
      case SERIALIZED_TYPE_ID_MAP.UInt128: {
        return {
          type: 'UINT128',
          value: Hash128.fromParser(parser).toJSON(),
        }
      }
      case SERIALIZED_TYPE_ID_MAP.UInt256: {
        return {
          type: 'UINT256',
          value: Hash256.fromParser(parser).toJSON(),
        }
      }
      case SERIALIZED_TYPE_ID_MAP.Amount: {
        return {
          type: 'AMOUNT',
          value: Amount.fromParser(parser).toJSON(),
        }
      }
      case SERIALIZED_TYPE_ID_MAP.Blob: {
        // parser.skip(20)
        return {
          type: 'VL',
          value: Blob.fromParser(
            parser,
            parser.readVariableLengthLength(),
          ).toJSON(),
        }
      }
      case SERIALIZED_TYPE_ID_MAP.AccountID: {
        parser.skip(1)
        return {
          type: 'ACCOUNT',
          value: AccountID.fromParser(parser).toJSON(),
        }
      }
      default: {
        throw new Error('Invalid type to construct an Data')
      }
    }
  }

  static fromUint8Bytes(bytes: Uint8Array): Data {
    const serializedTypeIDBytes = new Uint8Array(2)
    writeUInt16BE(serializedTypeIDBytes, SERIALIZED_TYPE_ID_MAP.UInt8, 0)
    return new Data(Uint8Array.from([...serializedTypeIDBytes, ...bytes]))
  }

  static fromUint16Bytes(bytes: Uint8Array): Data {
    const serializedTypeIDBytes = new Uint8Array(2)
    writeUInt16BE(serializedTypeIDBytes, SERIALIZED_TYPE_ID_MAP.UInt16, 0)
    return new Data(Uint8Array.from([...serializedTypeIDBytes, ...bytes]))
  }

  static fromUint32Bytes(bytes: Uint8Array): Data {
    const serializedTypeIDBytes = new Uint8Array(2)
    writeUInt16BE(serializedTypeIDBytes, SERIALIZED_TYPE_ID_MAP.UInt32, 0)
    return new Data(Uint8Array.from([...serializedTypeIDBytes, ...bytes]))
  }

  static fromUint64Bytes(bytes: Uint8Array): Data {
    const serializedTypeIDBytes = new Uint8Array(2)
    writeUInt16BE(serializedTypeIDBytes, SERIALIZED_TYPE_ID_MAP.UInt64, 0)
    return new Data(Uint8Array.from([...serializedTypeIDBytes, ...bytes]))
  }

  static fromUint128Bytes(bytes: Uint8Array): Data {
    const serializedTypeIDBytes = new Uint8Array(2)
    writeUInt16BE(serializedTypeIDBytes, SERIALIZED_TYPE_ID_MAP.UInt128, 0)
    return new Data(Uint8Array.from([...serializedTypeIDBytes, ...bytes]))
  }

  static fromUint256Bytes(bytes: Uint8Array): Data {
    const serializedTypeIDBytes = new Uint8Array(2)
    writeUInt16BE(serializedTypeIDBytes, SERIALIZED_TYPE_ID_MAP.UInt256, 0)
    return new Data(Uint8Array.from([...serializedTypeIDBytes, ...bytes]))
  }

  static fromAmountBytes(bytes: Uint8Array): Data {
    const serializedTypeIDBytes = new Uint8Array(2)
    writeUInt16BE(serializedTypeIDBytes, SERIALIZED_TYPE_ID_MAP.Amount, 0)
    return new Data(Uint8Array.from([...serializedTypeIDBytes, ...bytes]))
  }

  static fromBlobBytes(bytes: Uint8Array): Data {
    const serializedTypeIDBytes = new Uint8Array(2)
    writeUInt16BE(serializedTypeIDBytes, SERIALIZED_TYPE_ID_MAP.Blob, 0)
    const variableLengthBytes = this.encodeVariableLength(bytes.length)
    return new Data(
      Uint8Array.from([
        ...serializedTypeIDBytes,
        ...variableLengthBytes,
        ...bytes,
      ]),
    )
  }

  static fromAccountIDBytes(bytes: Uint8Array): Data {
    const serializedTypeIDBytes = new Uint8Array(2)
    writeUInt16BE(serializedTypeIDBytes, SERIALIZED_TYPE_ID_MAP.AccountID, 0)
    const variableLengthBytes = this.encodeVariableLength(bytes.length)
    return new Data(
      Uint8Array.from([
        ...serializedTypeIDBytes,
        ...variableLengthBytes,
        ...bytes,
      ]),
    )
  }

  static encodeVariableLength(length: number): Uint8Array {
    const lenBytes = new Uint8Array(3)
    if (length <= 192) {
      lenBytes[0] = length
      return lenBytes.slice(0, 1)
    } else if (length <= 12480) {
      length -= 193
      lenBytes[0] = 193 + (length >>> 8)
      lenBytes[1] = length & 0xff
      return lenBytes.slice(0, 2)
    } else if (length <= 918744) {
      length -= 12481
      lenBytes[0] = 241 + (length >>> 16)
      lenBytes[1] = (length >> 8) & 0xff
      lenBytes[2] = length & 0xff
      return lenBytes.slice(0, 3)
    }
    throw new Error('Overflow error')
  }
}

export { Data, type DataObject }

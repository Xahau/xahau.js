import { SERIALIZED_TYPE_ID_MAP } from '../enums'
import { BinaryParser } from '../serdes/binary-parser'
import { writeUInt16BE } from '../utils'

import { JsonObject, SerializedType } from './serialized-type'

import { hexToBytes } from '@xrplf/isomorphic/utils'

/**
 * Interface for JSON objects that represent data
 */
interface DataTypeObject extends JsonObject {
  type: string
}

/**
 * Type guard for DataObject
 */
function isDataTypeObject(arg): arg is DataTypeObject {
  const keys = Object.keys(arg).sort()
  return keys.length === 1 && keys[0] === 'type'
}

/**
 * Class for serializing/Deserializing Data
 */
class DataType extends SerializedType {
  static defaultData: DataType = new DataType(hexToBytes('0001'))

  constructor(bytes: Uint8Array) {
    super(bytes ?? DataType.defaultData.bytes)
  }

  /**
   * Construct an data from Data Object
   *
   * @param value An Amount, object representing an IOU, or a string
   *     representing an integer amount
   * @returns An Amount object
   */
  // eslint-disable-next-line complexity
  static from<T extends DataType | DataTypeObject>(value: T): DataType {
    if (value instanceof DataType) {
      return value
    }

    if (isDataTypeObject(value)) {
      let innerSerializedTypeID: number
      switch (value.type) {
        case 'UINT8': {
          innerSerializedTypeID = SERIALIZED_TYPE_ID_MAP.UInt8
          break
        }
        case 'UINT16': {
          innerSerializedTypeID = SERIALIZED_TYPE_ID_MAP.UInt16
          break
        }
        case 'UINT32': {
          innerSerializedTypeID = SERIALIZED_TYPE_ID_MAP.UInt32
          break
        }
        case 'UINT64': {
          innerSerializedTypeID = SERIALIZED_TYPE_ID_MAP.UInt64
          break
        }
        case 'UINT128': {
          innerSerializedTypeID = SERIALIZED_TYPE_ID_MAP.UInt128
          break
        }
        case 'UINT256': {
          innerSerializedTypeID = SERIALIZED_TYPE_ID_MAP.UInt256
          break
        }
        case 'VL': {
          innerSerializedTypeID = SERIALIZED_TYPE_ID_MAP.Blob
          break
        }
        case 'ACCOUNT': {
          innerSerializedTypeID = SERIALIZED_TYPE_ID_MAP.AccountID
          break
        }
        case 'AMOUNT': {
          innerSerializedTypeID = SERIALIZED_TYPE_ID_MAP.Amount
          break
        }
        default: {
          throw new Error('Invalid type to construct an DataType')
        }
      }

      const bytes = new Uint8Array(2)
      writeUInt16BE(bytes, innerSerializedTypeID, 0)

      return new DataType(bytes)
    }

    throw new Error('Invalid type to construct an DataType')
  }

  /**
   * Read an amount from a BinaryParser
   *
   * @param parser BinaryParser to read the Amount from
   * @returns An Amount object
   */
  static fromParser(parser: BinaryParser): DataType {
    return new DataType(parser.read(2))
  }

  /**
   * Get the JSON representation of this Amount
   *
   * @returns the JSON interpretation of this.bytes
   */
  toJSON(): DataTypeObject {
    const parser = new BinaryParser(this.toString())
    const innerSerializedTypeID = parser.readUInt16()

    switch (innerSerializedTypeID) {
      case SERIALIZED_TYPE_ID_MAP.UInt8: {
        return {
          type: 'UINT8',
        }
      }
      case SERIALIZED_TYPE_ID_MAP.UInt16: {
        return {
          type: 'UINT16',
        }
      }
      case SERIALIZED_TYPE_ID_MAP.UInt32: {
        return {
          type: 'UINT32',
        }
      }
      case SERIALIZED_TYPE_ID_MAP.UInt64: {
        return {
          type: 'UINT64',
        }
      }
      case SERIALIZED_TYPE_ID_MAP.UInt128: {
        return {
          type: 'UINT128',
        }
      }
      case SERIALIZED_TYPE_ID_MAP.UInt256: {
        return {
          type: 'UINT256',
        }
      }
      case SERIALIZED_TYPE_ID_MAP.Amount: {
        return {
          type: 'AMOUNT',
        }
      }
      case SERIALIZED_TYPE_ID_MAP.Blob: {
        return {
          type: 'VL',
        }
      }
      case SERIALIZED_TYPE_ID_MAP.AccountID: {
        return {
          type: 'ACCOUNT',
        }
      }
      default: {
        throw new Error('Invalid type to construct an DataType')
      }
    }
  }
}

export { DataType, DataTypeObject }

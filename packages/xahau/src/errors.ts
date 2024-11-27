/* eslint-disable max-classes-per-file -- Errors can be defined in the same file */
/**
 * Base Error class for xrpl.js. All Errors thrown by xrpl.js should throw
 * XahlErrors.
 *
 * @category Errors
 */
class XahlError extends Error {
  public readonly name: string
  public readonly message: string
  public readonly data?: unknown

  /**
   * Construct an XahlError.
   *
   * @param message - The error message.
   * @param data - The data that caused the error.
   */
  public constructor(message = '', data?: unknown) {
    super(message)

    this.name = this.constructor.name
    this.message = message
    this.data = data
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- `captureStackTrace` can be null in browsers
    if (Error.captureStackTrace != null) {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  /**
   * Converts the Error to a human-readable String form.
   *
   * @returns The String output of the Error.
   */
  public toString(): string {
    let result = `[${this.name}(${this.message}`
    if (this.data) {
      result += `, ${JSON.stringify(this.data)}`
    }
    result += ')]'
    return result
  }

  /**
   * Console.log in node uses util.inspect on object, and util.inspect allows
   * us to customize its output:
   * https://nodejs.org/api/util.html#util_custom_inspect_function_on_objects.
   *
   * @returns The String output of the Error.
   */
  public inspect(): string {
    return this.toString()
  }
}

/**
 * Error thrown when rippled responds with an error.
 *
 * @category Errors
 */
class XahaudError extends XahlError {}

/**
 * Error thrown when xrpl.js cannot specify error type.
 *
 * @category Errors
 */
class UnexpectedError extends XahlError {}

/**
 * Error thrown when xrpl.js has an error with connection to rippled.
 *
 * @category Errors
 */
class ConnectionError extends XahlError {}

/**
 * Error thrown when xrpl.js is not connected to rippled server.
 *
 * @category Errors
 */
class NotConnectedError extends ConnectionError {}

/**
 * Error thrown when xrpl.js has disconnected from rippled server.
 *
 * @category Errors
 */
class DisconnectedError extends ConnectionError {}

/**
 * Error thrown when rippled is not initialized.
 *
 * @category Errors
 */
class XahaudNotInitializedError extends ConnectionError {}

/**
 * Error thrown when xrpl.js times out.
 *
 * @category Errors
 */
class TimeoutError extends ConnectionError {}

/**
 * Error thrown when xrpl.js sees a response in the wrong format.
 *
 * @category Errors
 */
class ResponseFormatError extends ConnectionError {}

/**
 * Error thrown when xrpl.js sees a malformed transaction.
 *
 * @category Errors
 */
class ValidationError extends XahlError {}

/**
 * Error thrown when a client cannot generate a wallet from the testnet/devnet
 * faucets, or when the client cannot infer the faucet URL (i.e. when the Client
 * is connected to mainnet).
 *
 * @category Errors
 */
class XAHLFaucetError extends XahlError {}

/**
 * Error thrown when xrpl.js cannot retrieve a transaction, ledger, account, etc.
 * From rippled.
 *
 * @category Errors
 */
class NotFoundError extends XahlError {
  /**
   * Construct an XahlError.
   *
   * @param message - The error message. Defaults to "Not found".
   */
  public constructor(message = 'Not found') {
    super(message)
  }
}

export {
  XahlError,
  UnexpectedError,
  ConnectionError,
  XahaudError,
  NotConnectedError,
  DisconnectedError,
  XahaudNotInitializedError,
  TimeoutError,
  ResponseFormatError,
  ValidationError,
  NotFoundError,
  XAHLFaucetError,
}

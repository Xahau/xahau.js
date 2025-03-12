const RIPPLE_EPOCH_DIFF = 0x386d4380

/**
 * Convert a xahau timestamp to a unix timestamp.
 *
 * @param rpepoch - (seconds since 1/1/2000 GMT).
 * @returns Milliseconds since unix epoch.
 * @category Utilities
 */
function rippleTimeToUnixTime(rpepoch: number): number {
  return (rpepoch + RIPPLE_EPOCH_DIFF) * 1000
}

/**
 * Convert a unix timestamp to a xahau timestamp.
 *
 * @param timestamp - (ms since unix epoch).
 * @returns Seconds since Ripple Epoch (1/1/2000 GMT).
 * @category Utilities
 */
function unixTimeToRippleTime(timestamp: number): number {
  return Math.round(timestamp / 1000) - RIPPLE_EPOCH_DIFF
}

/**
 * Convert a xahau timestamp to an Iso8601 timestamp.
 *
 * @param xahauTime - Is the number of seconds since Ripple Epoch (1/1/2000 GMT).
 * @returns Iso8601 international standard date format.
 * @category Utilities
 */
function rippleTimeToISOTime(xahauTime: number): string {
  return new Date(rippleTimeToUnixTime(xahauTime)).toISOString()
}

/**
 * Convert an ISO8601 timestmap to a xahau timestamp.
 *
 * @param iso8601 - International standard date format.
 * @returns Seconds since xahau epoch (1/1/2000 GMT).
 * @category Utilities
 */
function isoTimeToRippleTime(iso8601: string | Date): number {
  const isoDate = typeof iso8601 === 'string' ? new Date(iso8601) : iso8601
  return unixTimeToRippleTime(isoDate.getTime())
}

export {
  rippleTimeToUnixTime,
  unixTimeToRippleTime,
  rippleTimeToISOTime,
  isoTimeToRippleTime,
}

#!/usr/bin/env node
/*
 * Checks that packages/xahau-binary-codec/src/enums/definitions.json matches the
 * `server_definitions` reported by a running xahaud.
 *
 * Usage: node scripts/check-definitions.js [rpc-url]   (default: http://localhost:5005)
 */
const fs = require('fs')
const path = require('path')

const DEFINITIONS_PATH = path.join(
  __dirname,
  '..',
  'packages',
  'xahau-binary-codec',
  'src',
  'enums',
  'definitions.json',
)

function stable(value) {
  if (Array.isArray(value)) {
    return value.map(stable)
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, stable(value[key])]),
    )
  }
  return value
}

function diffKeys(label, expected, actual, { ignoreExtra = false } = {}) {
  const lines = []
  const keys = new Set([...Object.keys(expected), ...Object.keys(actual)])
  for (const key of keys) {
    if (!(key in actual)) {
      lines.push(`${label}.${key}: missing from server_definitions`)
    } else if (!(key in expected)) {
      if (ignoreExtra) {
        console.log(
          `note: ${label}.${key} is reported by server_definitions but not kept in definitions.json`,
        )
      } else {
        lines.push(`${label}.${key}: missing from definitions.json`)
      }
    } else if (
      JSON.stringify(stable(expected[key])) !==
      JSON.stringify(stable(actual[key]))
    ) {
      lines.push(`${label}.${key}: differs`)
    }
  }
  return lines
}

async function main() {
  const url = process.argv[2] ?? 'http://localhost:5005'
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ method: 'server_definitions' }),
  })
  const { result } = await response.json()
  if (result == null || result.status !== 'success') {
    throw new Error(`server_definitions failed: ${JSON.stringify(result)}`)
  }
  const { status: _status, ...serverDefinitions } = result
  const fileDefinitions = JSON.parse(fs.readFileSync(DEFINITIONS_PATH, 'utf8'))

  // definitions.json keeps the sections the codec needs; server_definitions may report more (e.g. HOOK, features).
  const lines = diffKeys('definitions', fileDefinitions, serverDefinitions, {
    ignoreExtra: true,
  })
  for (const section of [
    'FIELDS',
    'LEDGER_ENTRY_TYPES',
    'TRANSACTION_RESULTS',
    'TRANSACTION_TYPES',
    'TYPES',
  ]) {
    if (section in fileDefinitions && section in serverDefinitions) {
      const toMap = (value) =>
        Array.isArray(value) ? Object.fromEntries(value) : value
      lines.push(
        ...diffKeys(
          section,
          toMap(fileDefinitions[section]),
          toMap(serverDefinitions[section]),
        ),
      )
    }
  }

  if (lines.length > 0) {
    console.error('definitions.json does not match server_definitions:')
    for (const line of lines) {
      console.error(`  ${line}`)
    }
    process.exit(1)
  }
  console.log(`definitions.json matches server_definitions (${url})`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

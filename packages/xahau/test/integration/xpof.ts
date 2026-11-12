/**
 * Forges the XPOF (proof of fees) of a ledger of another network, with
 * deterministic test keys, for the Ingest transaction of the Export
 * amendment. A standalone node has no other network, so everything it would
 * verify is made up here: the ledger, its validation, the UNL and its
 * publisher. The publisher's key must be trusted by the node: it is listed
 * under `[import_vl_keys]` in `.ci-config/validators.txt` (EXPORT_TEST_VL_KEY).
 *
 * The layout is what `Ingest::parse` (xahaud, src/xrpld/app/tx/detail/Ingest.cpp)
 * verifies. An XPOF is an XPOP (Import) without a transaction:
 *   ledger      the header fields of the ledger
 *   parent      hex: the header of its parent, 118 bytes (burn = coins difference)
 *   validation  data: {signing key: validation}, unl: the VL, its manifest and signature
 *   tree        every inner node of the transaction tree, as on the wire
 *   samples     the 8 transactions Ingest::sampleLeaves picks, with their meta
 * and it must be in canonical form: the very bytes `Json::to_string` writes
 * (keys in order, no whitespace, hex in upper case, base64 padded), which is
 * why the object literal below lists its keys alphabetically.
 */
import { hexToBytes, stringToHex } from '@xrplf/isomorphic/utils'
import { encode } from 'xahau-binary-codec'
import { deriveKeypair, generateSeed, sign } from 'xahau-keypairs'

import { encodeNodePublic } from '../../src'
import sha512Half from '../../src/utils/hashes/sha512Half'

interface KeyPair {
  publicKey: string
  privateKey: string
}

function testKey(
  role: string,
  algorithm: 'ecdsa-secp256k1' | 'ed25519',
): KeyPair {
  // deterministic: the seed's entropy is the first half of sha512Half(role)
  const entropy = hexToBytes(sha512Half(stringToHex(`xahau.js export ${role}`)))
  return deriveKeypair(generateSeed({ entropy, algorithm }), { algorithm })
}

const VL_MASTER = testKey('vl master', 'ecdsa-secp256k1')
const VL_SIGNING = testKey('vl signing', 'ecdsa-secp256k1')
const VALIDATOR_MASTER = testKey('validator master', 'ed25519')
const VALIDATOR_SIGNING = testKey('validator signing', 'ecdsa-secp256k1')

/**
 * The key of the forged VL publisher, which the node must trust for network 0
 * (see `.ci-config/validators.txt`).
 */
export const EXPORT_TEST_VL_KEY = VL_MASTER.publicKey

// HashPrefix values: three characters and a NUL
const prefix = (text: string): string => `${stringToHex(text)}00`
const TX_ID = prefix('TXN')
const TX_NODE = prefix('SND')
const INNER_NODE = prefix('MIN')
const LEDGER = prefix('LWR')
const VALIDATION = prefix('VAL')
const MANIFEST = prefix('MAN')
const NO_HASH = '0'.repeat(64)

const hexNum = (value: number, bytes: number): string =>
  value
    .toString(16)
    .toUpperCase()
    .padStart(bytes * 2, '0')

const hash = (...parts: string[]): string => sha512Half(parts.join(''))

const base64 = (hex: string): string =>
  btoa(String.fromCharCode(...hexToBytes(hex)))

// variable-length prefix, for the lengths used here (192 bytes at most)
const vl = (hex: string): string => hexNum(hex.length / 2, 1) + hex

function manifest(master: KeyPair, signing: KeyPair): string {
  const body = {
    Sequence: 1,
    PublicKey: master.publicKey,
    SigningPubKey: signing.publicKey,
  }
  const signed = MANIFEST + encode(body)
  return base64(
    encode({
      ...body,
      Signature: sign(signed, signing.privateKey),
      MasterSignature: sign(signed, master.privateKey),
    }),
  )
}

// a payment there that burned `fee` drops, multisigned by `signers`
function transaction(index: number, fee: number, signers: number): string {
  const account = 'rrrrrrrrrrrrrrrrrrrrrhoLvTp'
  return encode({
    TransactionType: 'Payment',
    Account: account,
    Sequence: index,
    Fee: String(fee),
    SigningPubKey: '',
    ...(signers
      ? {
          Signers: Array.from({ length: signers }, () => ({
            // a Signer has all its fields (an empty signature will do)
            Signer: { Account: account, SigningPubKey: '', TxnSignature: '' },
          })),
        }
      : {}),
  })
}

// the order of hex strings of one case, which is that of the hashes' bytes
function byteOrder(first: string, second: string): number {
  if (first < second) {
    return -1
  }
  return first > second ? 1 : 0
}

/** What a transaction tree is: the 16 children of each inner node, by hash. */
type InnerNodes = Map<string, string[]>

// a SHAMap: an inner node holds the items that share the first `depth` nibbles
// of their ids, an item alone in its branch is its leaf hash
function buildTree(
  items: Array<{ id: string; leaf: string }>,
  depth: number,
  inner: InnerNodes,
): string {
  const children = Array.from({ length: 16 }, (): string => NO_HASH)
  for (let branch = 0; branch < 16; branch += 1) {
    const group = items.filter(
      (item) => parseInt(item.id[depth], 16) === branch,
    )
    if (group.length === 1) {
      children[branch] = group[0].leaf
    } else if (group.length > 1) {
      children[branch] = buildTree(group, depth + 1, inner)
    }
  }
  const nodeHash = hash(INNER_NODE, ...children)
  inner.set(nodeHash, children)
  return nodeHash
}

// SHAMapInnerNode::serializeForWire: sparse nodes as (hash, branch) pairs
function wireNode(children: string[]): string {
  const used = children.filter((child) => child !== NO_HASH)
  if (used.length < 12) {
    return `${children
      .map((child, branch) => {
        if (child === NO_HASH) {
          return ''
        }
        return child + hexNum(branch, 1)
      })
      .join('')}03`
  }
  return `${children.join('')}02`
}

// Ingest::sampleLeaves: for each of 8 samples, walk down from the root along
// the nibbles of sha512Half(ledger, i), taking the next non-empty branch
function sampleLeaves(
  inner: InnerNodes,
  root: string,
  ledger: string,
): string[] {
  return Array.from({ length: 8 }, (_, sample) => {
    const target = hash(ledger, hexNum(sample, 4))
    let node = root
    for (let depth = 0; inner.has(node); depth += 1) {
      const children = inner.get(node) as string[]
      let branch = parseInt(target[depth], 16)
      while (children[branch] === NO_HASH) {
        branch = (branch + 1) % 16
      }
      node = children[branch]
    }
    return node
  })
}

/**
 * What `forgeXpof` makes: the `Blob` (hex) of an Ingest, the ledger index it
 * proves (the Ingest's `LedgerSequence`), and what Ingest records of it: the
 * number of transactions, the drops they burned and the median fee per
 * signature of the 8 sampled ones.
 */
export interface ForgedXpof {
  blob: string
  ledgerSequence: number
  transactions: number
  burnedDrops: number
  sampleFee: number
}

/**
 * Forge the XPOF of ledger `ledgerSequence` of another network: 40
 * transactions, most paying 12 drops, two whales and two multisigned.
 *
 * @param ledgerSequence - The index of the ledger there.
 * @returns The XPOF and what Ingest records of it.
 */
export function forgeXpof(ledgerSequence: number): ForgedXpof {
  // [fee in drops, number of signers]
  const fees: Array<[number, number]> = [
    ...Array.from({ length: 36 }, (): [number, number] => [12, 0]),
    [1_000_000, 0],
    [5_000_000, 0],
    [50, 4],
    [60, 2],
  ]
  const leaves = new Map<string, { tx: string; meta: string; unit: number }>()
  const items = fees.map(([fee, signers], index) => {
    const tx = transaction(index, fee, signers)
    // an empty metadata object
    const meta = 'E1'
    const id = hash(TX_ID, tx)
    const leaf = hash(TX_NODE, vl(tx), vl(meta), id)
    leaves.set(leaf, {
      tx,
      meta,
      unit: Math.max(10, Math.floor(fee / (1 + signers))),
    })
    return { id, leaf }
  })
  const burnedDrops = fees.reduce((sum, [fee]) => sum + fee, 0)
  const inner: InnerNodes = new Map()
  const txroot = buildTree(items, 0, inner)

  // the ledger, 4 seconds after its parent, and the parent that burned the fees
  const closeTime = 800_000_000
  const header = (fields: {
    seq: number
    coins: number
    parent: string
    tree: string
    account: string
  }): string =>
    hexNum(fields.seq, 4) +
    hexNum(fields.coins, 8) +
    fields.parent +
    fields.tree +
    fields.account +
    hexNum(closeTime - 4, 4) +
    hexNum(closeTime, 4) +
    hexNum(10, 1) +
    hexNum(0, 1)
  const parentCoins = 9_000_000_000_000_000
  const acroot = hexNum(2, 32)
  const parentHeader = header({
    seq: ledgerSequence - 1,
    coins: parentCoins,
    parent: hexNum(1, 32),
    tree: NO_HASH,
    account: NO_HASH,
  })
  const ledgerHeader = header({
    seq: ledgerSequence,
    coins: parentCoins - burnedDrops,
    parent: hash(LEDGER, parentHeader),
    tree: txroot,
    account: acroot,
  })
  const ledgerHash = hash(LEDGER, ledgerHeader)

  // the validation, by a validator the UNL lists
  const unsigned = {
    Flags: 0x80000001,
    LedgerSequence: ledgerSequence,
    SigningTime: closeTime + 1,
    LedgerHash: ledgerHash,
    SigningPubKey: VALIDATOR_SIGNING.publicKey,
  }
  const validation = encode({
    ...unsigned,
    Signature: sign(
      VALIDATION + encode(unsigned),
      VALIDATOR_SIGNING.privateKey,
    ),
  })

  // the UNL: a list of validators, signed by the publisher
  const list = stringToHex(
    JSON.stringify({
      sequence: 1,
      effective: 0,
      expiration: 4_000_000_000,
      validators: [
        {
          validation_public_key: VALIDATOR_MASTER.publicKey,
          manifest: manifest(VALIDATOR_MASTER, VALIDATOR_SIGNING),
        },
      ],
    }),
  )

  const sampled = sampleLeaves(inner, txroot, ledgerHash).map(
    (leaf) => leaves.get(leaf) as { tx: string; meta: string; unit: number },
  )
  const samples = sampled.map(({ tx, meta }) => ({ blob: tx, meta }))
  const units = sampled
    .map(({ unit }) => unit)
    .sort((first, second) => first - second)

  // the canonical form: keys in alphabetical order
  const xpof = {
    ledger: {
      acroot,
      close: closeTime,
      coins: String(parentCoins - burnedDrops),
      cres: 10,
      flags: 0,
      index: ledgerSequence,
      pclose: closeTime - 4,
      phash: hash(LEDGER, parentHeader),
      txroot,
    },
    parent: parentHeader,
    samples,
    tree: Array.from(inner.keys())
      .sort(byteOrder)
      .map((nodeHash) => wireNode(inner.get(nodeHash) as string[])),
    validation: {
      data: {
        [encodeNodePublic(hexToBytes(VALIDATOR_SIGNING.publicKey))]: validation,
      },
      unl: {
        blob: base64(list),
        manifest: manifest(VL_MASTER, VL_SIGNING),
        public_key: VL_MASTER.publicKey,
        signature: sign(list, VL_SIGNING.privateKey),
        version: 1,
      },
    },
  }
  return {
    blob: stringToHex(JSON.stringify(xpof)),
    ledgerSequence,
    transactions: fees.length,
    burnedDrops,
    sampleFee: units[units.length / 2],
  }
}

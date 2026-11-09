import { validateSetHook } from '../../src/models/transactions/setHook'
import { assertTxIsValid, assertTxValidationError } from '../testUtils'

const assertValid = (tx: any): void => assertTxIsValid(tx, validateSetHook)
const assertInvalid = (tx: any, message: string): void =>
  assertTxValidationError(tx, validateSetHook, message)

/**
 * SetHook Transaction Verification Testing.
 *
 * Providing runtime verification testing for each specific transaction type.
 */
describe('SetHook', function () {
  let setHookTx: any

  beforeEach(function () {
    setHookTx = {
      Flags: 0,
      TransactionType: 'SetHook',
      Account: 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn',
      Fee: '12',
      Hooks: [
        {
          Hook: {
            CreateCode:
              '0061736D01000000011C0460057F7F7F7F7F017E60037F7F7E017E60027F7F017F60017F017E02230303656E76057472616365000003656E7606616363657074000103656E76025F670002030201030503010002062B077F0141B088040B7F004180080B7F0041A6080B7F004180080B7F0041B088040B7F0041000B7F0041010B07080104686F6F6B00030AC4800001C0800001017F230041106B220124002001200036020C41920841134180084112410010001A410022002000420010011A41012200200010021A200141106A240042000B0B2C01004180080B254163636570742E633A2043616C6C65642E00224163636570742E633A2043616C6C65642E22',
            HookOn:
              'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBFFFF7',
            Flags: {
              hsfOverride: true,
            },
            HookCanEmit:
              'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBFFFF7',
            HookApiVersion: 0,
            HookNamespace:
              '4FF9961269BF7630D32E15276569C94470174A5DA79FA567C0F62251AA9A36B9',
            HookName: 'DEADBEEF',
          },
        },
      ],
    } as any
  })

  it(`verifies valid SetHook`, function () {
    assertValid(setHookTx)
  })

  it(`verifies valid HookOnIncoming/HookOnOutgoing pair`, function () {
    delete setHookTx.Hooks[0].Hook.HookOn
    setHookTx.Hooks[0].Hook.HookOnIncoming =
      'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBFFFF7'
    setHookTx.Hooks[0].Hook.HookOnOutgoing =
      'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBFFFF6'
    assertValid(setHookTx)
  })

  it(`throws w/ invalid Hooks`, function () {
    setHookTx.Hooks = 'khgfgyhujk'
    assertInvalid(setHookTx, 'SetHook: invalid field Hooks')

    delete setHookTx.Hooks
    assertInvalid(setHookTx, 'SetHook: missing field Hooks')
  })

  it(`throws w/ maximum of 10 members allowed in Hooks`, function () {
    setHookTx.Hooks = []
    const hook = {
      Hook: {
        CreateCode:
          '0061736D01000000011C0460057F7F7F7F7F017E60037F7F7E017E60027F7F017F60017F017E02230303656E76057472616365000003656E7606616363657074000103656E76025F670002030201030503010002062B077F0141B088040B7F004180080B7F0041A6080B7F004180080B7F0041B088040B7F0041000B7F0041010B07080104686F6F6B00030AC4800001C0800001017F230041106B220124002001200036020C41920841134180084112410010001A410022002000420010011A41012200200010021A200141106A240042000B0B2C01004180080B254163636570742E633A2043616C6C65642E00224163636570742E633A2043616C6C65642E22',
        HookOn:
          'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBFFFF7',
        Flags: 1,
        HookApiVersion: 0,
        HookNamespace:
          '4FF9961269BF7630D32E15276569C94470174A5DA79FA567C0F62251AA9A36B9',
      },
    }
    setHookTx.Hooks.push(hook)
    setHookTx.Hooks.push(hook)
    setHookTx.Hooks.push(hook)
    setHookTx.Hooks.push(hook)
    setHookTx.Hooks.push(hook)
    setHookTx.Hooks.push(hook)
    setHookTx.Hooks.push(hook)
    setHookTx.Hooks.push(hook)
    setHookTx.Hooks.push(hook)
    setHookTx.Hooks.push(hook)
    setHookTx.Hooks.push(hook)

    const errorMessage = 'SetHook: maximum of 10 hooks allowed in Hooks'
    assertInvalid(setHookTx, errorMessage)
  })

  it.each(['HookOn', 'HookOnIncoming', 'HookOnOutgoing'])(
    `throws w/ invalid %s in Hooks`,
    function (field: string) {
      setHookTx.Hooks = [
        {
          Hook: {
            CreateCode:
              '0061736D01000000011C0460057F7F7F7F7F017E60037F7F7E017E60027F7F017F60017F017E02230303656E76057472616365000003656E7606616363657074000103656E76025F670002030201030503010002062B077F0141B088040B7F004180080B7F0041A6080B7F004180080B7F0041B088040B7F0041000B7F0041010B07080104686F6F6B00030AC4800001C0800001017F230041106B220124002001200036020C41920841134180084112410010001A410022002000420010011A41012200200010021A200141106A240042000B0B2C01004180080B254163636570742E633A2043616C6C65642E00224163636570742E633A2043616C6C65642E22',
            [field]: '',
            Flags: 1,
            HookApiVersion: 0,
            HookNamespace:
              '4FF9961269BF7630D32E15276569C94470174A5DA79FA567C0F62251AA9A36B9',
          },
        },
      ]
      const errorMessage = `SetHook: ${field} in Hook must be a 256-bit (32-byte) hexadecimal value`
      assertInvalid(setHookTx, errorMessage)
    },
  )

  it(`throws w/ HookOn and HookOnIncoming/HookOnOutgoing together`, function () {
    Object.assign(setHookTx.Hooks[0].Hook, {
      HookOnIncoming:
        'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBFFFF7',
      HookOnOutgoing:
        'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBFFFF6',
    })
    const errorMessage =
      'SetHook: HookOn and HookOnIncoming/HookOnOutgoing in Hook are mutually exclusive'
    assertInvalid(setHookTx, errorMessage)
  })

  it(`throws w/ only one of HookOnIncoming/HookOnOutgoing`, function () {
    Object.assign(setHookTx.Hooks[0].Hook, {
      HookOn: undefined,
      HookOnIncoming:
        'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBFFFF7',
    })
    const errorMessage =
      'SetHook: HookOnIncoming and HookOnOutgoing in Hook must be specified together'
    assertInvalid(setHookTx, errorMessage)
  })

  it(`throws w/ equal HookOnIncoming and HookOnOutgoing`, function () {
    Object.assign(setHookTx.Hooks[0].Hook, {
      HookOn: undefined,
      HookOnIncoming:
        'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBFFFF7',
      HookOnOutgoing:
        'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBFFFF7'.toLowerCase(),
    })
    const errorMessage =
      'SetHook: HookOnIncoming and HookOnOutgoing in Hook must be different, use HookOn instead'
    assertInvalid(setHookTx, errorMessage)
  })

  it(`throws w/ invalid HookCanEmit in Hooks`, function () {
    setHookTx.Hooks = [
      {
        Hook: {
          CreateCode:
            '0061736D01000000011C0460057F7F7F7F7F017E60037F7F7E017E60027F7F017F60017F017E02230303656E76057472616365000003656E7606616363657074000103656E76025F670002030201030503010002062B077F0141B088040B7F004180080B7F0041A6080B7F004180080B7F0041B088040B7F0041000B7F0041010B07080104686F6F6B00030AC4800001C0800001017F230041106B220124002001200036020C41920841134180084112410010001A410022002000420010011A41012200200010021A200141106A240042000B0B2C01004180080B254163636570742E633A2043616C6C65642E00224163636570742E633A2043616C6C65642E22',
          HookOn:
            'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBFFFF7',
          HookCanEmit: '',
          Flags: 1,
          HookApiVersion: 0,
          HookNamespace:
            '4FF9961269BF7630D32E15276569C94470174A5DA79FA567C0F62251AA9A36B9',
        },
      },
    ]
    const errorMessage =
      'SetHook: HookCanEmit in Hook must be a 256-bit (32-byte) hexadecimal value'
    assertInvalid(setHookTx, errorMessage)
  })

  it(`throws w/ invalid HookNamespace in Hooks`, function () {
    setHookTx.SignerQuorum = 2
    setHookTx.Hooks = [
      {
        Hook: {
          CreateCode:
            '0061736D01000000011C0460057F7F7F7F7F017E60037F7F7E017E60027F7F017F60017F017E02230303656E76057472616365000003656E7606616363657074000103656E76025F670002030201030503010002062B077F0141B088040B7F004180080B7F0041A6080B7F004180080B7F0041B088040B7F0041000B7F0041010B07080104686F6F6B00030AC4800001C0800001017F230041106B220124002001200036020C41920841134180084112410010001A410022002000420010011A41012200200010021A200141106A240042000B0B2C01004180080B254163636570742E633A2043616C6C65642E00224163636570742E633A2043616C6C65642E22',
          HookOn:
            'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBFFFF7',
          Flags: 1,
          HookApiVersion: 0,
          HookNamespace: '',
        },
      },
    ]
    const errorMessage =
      'SetHook: HookNamespace in Hook must be a 256-bit (32-byte) hexadecimal value'
    assertInvalid(setHookTx, errorMessage)
  })

  it.each([
    '00',
    '0000',
    '000000',
    '0'.repeat(7),
    '0'.repeat(33),
    'ZZZZZZZZ',
    'DEADBEEF0',
  ])(`throws w/ invalid HookName in Hooks: %s`, function (value: string) {
    setHookTx.Hooks = [
      {
        Hook: {
          HookName: value,
        },
      },
    ]
    const errorMessage =
      'SetHook: HookName in Hook must be a hex string of 8-32 hex characters'
    assertInvalid(setHookTx, errorMessage)
  })

  it(`valid HookName "" (deletion) in Hooks`, function () {
    setHookTx.Hooks = [
      {
        Hook: {
          HookName: '',
        },
      },
    ]
    assertValid(setHookTx)
  })
})

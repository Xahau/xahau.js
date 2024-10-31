// Jest configuration for api
const base = require('../../jest.config.base.js')

module.exports = {
  ...base,
  roots: [...base.roots, '<rootDir>/test'],
  testMatch: ['<rootDir>/test/**/*.test.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/test/integration',
    '<rootDir>/test/fixtures',
    '<rootDir>/test/models/AMMCreate.test.ts',
    '<rootDir>/test/models/AMMDelete.test.ts',
    '<rootDir>/test/models/AMMDeposit.test.ts',
    '<rootDir>/test/models/AMMWithdraw.test.ts',
    '<rootDir>/test/models/AMMBid.test.ts',
    '<rootDir>/test/models/AMMVote.test.ts',
    '<rootDir>/test/models/ammInfo.test.ts',
    '<rootDir>/test/models/XChainClaim.test.ts',
    '<rootDir>/test/models/XChainCommit.test.ts',
    '<rootDir>/test/models/XChainCreateBridge.test.ts',
    '<rootDir>/test/models/XChainModifyBridge.test.ts',
    '<rootDir>/test/models/XChainCreateClaimID.test.ts',
    '<rootDir>/test/models/XChainAccountCreateCommit.test.ts',
    '<rootDir>/test/models/XChainAddAccountCreateAttestation.test.ts',
    '<rootDir>/test/models/XChainAddClaimAttestation.test.ts',
    '<rootDir>/test/models/XChainAddClaimAttestation.test.ts',
    '<rootDir>/test/models/DIDSet.test.ts',
    '<rootDir>/test/models/DIDDelete.test.ts',
    '<rootDir>/test/models/clawback.test.ts',
    '<rootDir>/test/models/oracleSet.test.ts',
    '<rootDir>/test/models/oracleDelete.test.ts',
  ],
  displayName: 'xrpl.js',
}

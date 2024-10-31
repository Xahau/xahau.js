// Jest configuration for api
const base = require('../../jest.config.base.js')

module.exports = {
  ...base,
  roots: [...base.roots, '<rootDir>/test'],
  testTimeout: 20000,
  testMatch: [
    '<rootDir>/test/integration/**/*.test.ts',
    '<rootDir>/test/integration/*.test.ts',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/test/integration/requests/ammInfo.test.ts',
    '<rootDir>/test/integration/transactions/ammBid.test.ts',
    '<rootDir>/test/integration/transactions/ammCreate.test.ts',
    '<rootDir>/test/integration/transactions/ammDelete.test.ts',
    '<rootDir>/test/integration/transactions/ammDeposit.test.ts',
    '<rootDir>/test/integration/transactions/ammVote.test.ts',
    '<rootDir>/test/integration/transactions/ammWithdraw.test.ts',
    '<rootDir>/test/integration/transactions/clawback.test.ts',
    '<rootDir>/test/integration/transactions/didDelete.test.ts',
    '<rootDir>/test/integration/transactions/didSet.test.ts',
    '<rootDir>/test/integration/transactions/oracleDelete.test.ts',
    '<rootDir>/test/integration/transactions/oracleSet.test.ts',
    '<rootDir>/test/integration/transactions/xchainAccountCreateCommit.test.ts',
    '<rootDir>/test/integration/transactions/xchainAddAccountCreateAttestation.test.ts',
    '<rootDir>/test/integration/transactions/xchainAddClaimAttestation.test.ts',
    '<rootDir>/test/integration/transactions/xchainClaim.test.ts',
    '<rootDir>/test/integration/transactions/xchainCommit.test.ts',
    '<rootDir>/test/integration/transactions/xchainCreateBridge.test.ts',
    '<rootDir>/test/integration/transactions/xchainCreateClaimID.test.ts',
    '<rootDir>/test/integration/transactions/xchainModifyBridge.test.ts',
  ],

  displayName: 'xrpl.js',
}

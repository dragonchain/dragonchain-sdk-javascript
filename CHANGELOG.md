# Changelog

## 4.0.0

Because Dragonchain has a breaking change to replace its indexing solution, this is also a breaking SDK change for queries and custom indexing.

The following are worth noting when transitioning from 3.X.X to 4.X.X:

- Custom indexes have changed for a new redisearch schema. Transaction types
  can no longer be updated, and custom indexes must be provided upfront when
  creating a transaction type or smart contract. If updating is desired,
  simply delete and recreate the relevant transaction type/smart contract
  with the new desired custom indexes.
- A transaction type's indexes are now removed when the transaction type is
  deleted. You can no longer query for transactions from a deleted transaction
  type (or smart contract). (The transactions still exist and can be retrieved
  directly by transaction id, they simply can't be searched with a query)
- Querying blocks and transactions are completely different, and now use
  [Redisearch queries](https://oss.redislabs.com/redisearch/Query_Syntax.html).
  Check their client functions for argument reference. Note the response schema
  of queries remain unchanged.
- Smart contract querying has been removed, and instead replaced with a generic
  `list_smart_contracts` which simply returns all contracts.

Check [the docs](https://node-sdk-docs.dragonchain.com/latest/) for more details on migrating from v3 to v4.

- **Feature:**
  - Support new query endpoints/parameters for redisearch replacement on dragonchain
  - Support adding custom indexes for smart contracts on creation
  - Support optionally fetching ids only (not entire documents) for querying
  - Support list smart contracts
  - Support disable schedule for `updateSmartContract`
  - Support new get logs endpoint
- **Documentation:**
  - Added docs for migrating from v3 to v4
- **CICD:**
  - Add NodeJS 12 to PR checks
- **Packaging:**
  - Remove some unnecessary files from the packaged release
- **Bug Fix**
  - Increase precision on timestamp sent to Dragonchain to prevent replay attack error for subsequent requests

## 3.2.0

- **Feature:**
  - Add deprecation warnings for `createBitcoinTransaction`, `createEthereumTransaction`, and `getPublicBlockchainAddresses`
  - Add support for new interchain management endpoints with client functions:
    - `createBitcoinInterchain`
    - `createEthereumInterchain`
    - `updateBitcoinInterchain`
    - `updateEthereumInterchain`
    - `getInterchainNetwork`
    - `deleteInterchainNetwork`
    - `listInterchainNetworks`
    - `setDefaultInterchainNetwork`
    - `getDefaultInterchainNetwork`
    - `signBitcoinTransaction`
    - `signEthereumTransaction`
- **Packaging:**
  - Moved repository to [new location](https://github.com/dragonchain/dragonchain-sdk-javascript)
- **Development:**
  - Update development dependencies

## 3.1.0

- **Feature:**
  - Use new versioned api endpoints
  - Add support for pending verifications endpoint

## 3.0.9

- **Feature:**
  - Added support for nicknamed api keys
- **Packaging:**
  - Condense TSConfig to a single file
  - Switch build to target ES5 for better backwards-compatibility/legacy support
- **CICD:**
  - Update cicd for new AWS buildspec runtimes
- **Development:**
  - Switch to eslint for linting
  - Add and enforce prettier for formatting
  - Remove outdated integration tests
  - Added code owners which are required for PR review
  - Added issue and PR templates for github
- **Documentation:**
  - Added changelog

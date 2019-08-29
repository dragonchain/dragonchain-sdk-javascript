# Dragonchain JS SDK

[![Latest npm version](https://img.shields.io/npm/v/dragonchain-sdk)](https://www.npmjs.com/package/dragonchain-sdk)
[![Build Status](https://img.shields.io/travis/dragonchain/dragonchain-sdk-javascript)](https://travis-ci.org/dragonchain/dragonchain-sdk-javascript)
[![Test Coverage](https://img.shields.io/codeclimate/coverage/dragonchain/dragonchain-sdk-javascript)](https://codeclimate.com/github/dragonchain/dragonchain-sdk-javascript)
[![Node Version Support](https://img.shields.io/node/v/dragonchain-sdk)](https://github.com/dragonchain/dragonchain-sdk-javascript)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)
[![License](https://img.shields.io/badge/license-Apache%202.0-informational.svg)](https://github.com/dragonchain/dragonchain-sdk-javascript/blob/master/LICENSE)
![Banana Index](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fnode-sdk-docs.dragonchain.com%2Fbanana-shield.json)

Talk to your dragonchain.

## Docs

Full docs for the SDK [can be found here](https://node-sdk-docs.dragonchain.com/latest).

## Installation

```sh
npm i dragonchain-sdk --save
```

## Tutorial / Examples

A tutorial on creating a custom contract can be [found here](https://github.com/dragonchain-inc/custom-contract-node-sdk).

### Initialize The Client

```javascript
const sdk = require('dragonchain-sdk');

const main = async () => {
  const client = await sdk.createClient({
    dragonchainId: 'c2dffKwiGj6AGg4zHkNswgEcyHeQaGr4Cm5SzsFVceVv'
  });
  // Do something with the client here
};

main()
  .then(console.log)
  .catch(console.error);
```

### GetBlock

```javascript
const call = await client.getBlock({ blockId: '56841' });

if (call.ok) {
  console.log('Successful call!');
  console.log(`Block: ${call.response}`);
} else {
  console.error('Something went wrong!');
  console.error(`HTTP status code from chain: ${call.status}`);
  console.error(`Error response from chain: ${call.response}`);
}
```

### QueryTransactions

```javascript
const searchResult = await client.queryTransactions({ transactionType: 'example', redisearchQuery: 'somethingInTxnTag' });

if (call.ok) {
  console.log('Successful call!');
  console.log(`Query Result: ${searchResult.response}`);
} else {
  console.error('Something went wrong!');
  console.error(`HTTP status code from chain: ${searchResult.status}`);
  console.error(`Error response from chain: ${searchResult.response}`);
}
```

## Configuration

In order to use this SDK, you need to have an Auth Key as well as
an Auth Key ID for a given Dragonchain ID. It is also strongly suggested that
you supply an endpoint locally so that a remote service isn't called to
automatically discover your dragonchain endpoint. These can be loaded into the
sdk in various ways, and are checked in the following order of precedence:

1. The `createClient` method can be initialized with an object containing
   the parameters `dragonchainId: <ID>`, `authKey: <KEY>`,
   `authKeyId: <KEY_ID>`, and `endpoint: <URL>`

2. The environment variables `DRAGONCHAIN_ID`,
   `AUTH_KEY`, `AUTH_KEY_ID`, and `DRAGONCHAIN_ENDPOINT`,
   can be set with the appropriate values

3. An ini-style credentials file can be provided at
   `~/.dragonchain/credentials` (or on Windows:
   `%LOCALAPPDATA%\dragonchain\credentials`) where the section name is the
   dragonchain id, with values for `auth_key`, `auth_key_id`, and `endpoint`.
   Additionally, you can supply a value for `dragonchain_id` in the
   `default` section to initialize the client for a specific chain
   without supplying an ID any other way

```ini
[default]
dragonchain_id = c2dffKwiGj6AGg4zHkNswgEcyHeQaGr4Cm5SzsFVceVv

[c2dffKwiGj6AGg4zHkNswgEcyHeQaGr4Cm5SzsFVceVv]
auth_key_id = JSDMWFUJDVTC
auth_key = n3hlldsFxFdP2De0yMu6A4MFRh1HGzFvn6rJ0ICZzkE
endpoint = https://35a7371c-a20a-4830-9a59-5d654fcd0a4a.api.dragonchain.com

[28VhSgtPhwkhKBgmQSW6vrsir7quEYHdCjqsW6aAYbfrw]
auth_key_id = OGNHGLYIFVUA
auth_key = aS73Si7agvX9gfxnLMh6ack9DEuidKiwQxkqBudXl81
endpoint = https://28567017-6412-44b6-80b2-12876fb3d4f5.api.dragonchain.com
```

## Logging

In order to get the logging output of the sdk, a logger must be set (by default all logging is ignored).

In order to set the logger, simply call `.setLogger` on the root of the require/import. For example, if you just wanted to log with `console` (i.e. stdout, stderr, etc), you can set the logger like the following:

```javascript
const sdk = require('dragonchain-sdk');
sdk.setLogger(console);
```

In that example, `console` can be replaced with any custom logger as long as it implements `log`, `info`, `warn`, `debug`, and `error` functions.

To reset the logger back to default (so it doesn't output anymore), simply called `setLogger()` with no params.

## Updating

### Migrating from version 3.X.X to version 4

If you update your dragonchain from version 3.X.X to version 4.0.0 or later, you will lose access to your version 3.X.X custom indexes.
More information can be found [here](https://dragonchain-core-docs.dragonchain.com/latest/deployment/migrating_v4.html).

Transactions from before this update will still exist, and blockchain integrity will not be compromised.
If there are important transactions that you would like to query from before the update, we suggest saving the transaction ids and getting the transactions directly.
If you rely on custom indexes and queries, this section will guide you through key differences.

Custom Indexing in version 4.0.0 and later uses Redisearch. To create a custom index in these versions, you must create a new index using [redisearch fields](https://oss.redislabs.com/redisearch/Commands.html#field_options).
Dragonchain version 4.0.0 supports the use of `text`, `tag`, and `number` fields.
Your custom indexes may further be customized by specifying options.
Options for `text` fields include `weight`, `noStem`, `sortable`, and `noIndex`. Options for `tag` fields include `separator` and `noIndex`. Options for `number` fields include `sortable` and `noIndex`.
Just like with the previous indexing solution, each field must have a `path` and a `fieldName` (previously `key`) to uniquely identify it within a payload.

Querying on version 4.0.0 and later uses a different query syntax.
Redisearch query syntax can be found [here](https://oss.redislabs.com/redisearch/Query_Syntax.html).

Dragonchains of version 4.0.0 or later will not support updating of custom indexes.
Instead, an index must be deleted and then re-created to change its indexes.
When an index is deleted, all indexed items will be permanently removed.
Be cautious when deleting indexes as they cannot be recovered.
Custom indexes for smart contracts and transaction types must be declared when they are created.

#### Method changes

- `queryTransactions` method signature has changed from (luceneQuery, sort, offset, limit) to (transactionType, redisearchQuery, verbatim, offset, limit, sortBy, sortAscending,     idsOnly). [verbatim](https://oss.redislabs.com/redisearch/Commands.html#ftsearch) means that the query will not use stems and `idsOnly` improves performance by returning only     the transaction ids that match the query, rather than the full object.
  Though the input parameters have changed, the return schema of query methods has not changed.

- `queryBlocks` method signature has changed from (luceneQuery, sort, offset, limit) to (redisearchQuery, offset, limit, sortBy, sortAscending, idsOnly).
It has the same behavior as queryTransactions.

- `customIndexFields` has replaced `customIndex` in `createTransactionType`.

- `customIndexFields` has been added to `createSmartContract`.
  This allows you to create custom indexes on the transaction type created by a smart contract in one step, which is required for custom indexes.
  The type is the same as the `customIndexFields` from the `createTransactionType` object.

- `querySmartContracts` has been removed. `listSmartContracts` has been provided as an alternative and returns a list of all smart contracts on the chain.

- `updateTransactionType` has been removed.

## Contributing

Dragonchain is happy to welcome contributions from the community. You can get started [here](https://github.com/dragonchain/dragonchain-sdk-javascript/blob/master/CONTRIBUTING.md).

/**
 * Copyright 2019 Dragonchain, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { L1DragonchainTransactionFull, DragonchainTransactionCreateResponse, DragonchainBulkTransactionCreateResponse, SmartContractAtRest, SmartContractList, L1DragonchainStatusResult, Response, QueryResult, BlockSchemaType, Verifications, PendingVerifications, levelVerifications, TransactionTypeResponse, PublicBlockchainTransactionResponse, PublicBlockchainAddressListResponse, SimpleResponse, TransactionTypeListResponse, TransactionTypeCustomIndex, BitcoinTransactionOutputs, BulkTransactionPayload, ListAPIKeyResponse, CreateAPIKeyResponse, GetAPIKeyResponse, DeleteAPIKeyResponse, EthereumInterchainNetwork, BitcoinInterchainNetwork, SupportedInterchains, InterchainNetworkList, SmartContractLogs } from '../../interfaces/DragonchainClientInterfaces';
import { CredentialService } from '../credential-service/CredentialService';
/**
 * HTTP Client that interfaces with the dragonchain api
 */
export declare class DragonchainClient {
    /**
     * @hidden
     */
    private endpoint;
    /**
     * @hidden
     */
    private verify;
    /**
     * @hidden
     */
    private credentialService;
    /**
     * @hidden
     */
    private fetch;
    /**
     * @hidden
     */
    private readFileAsync;
    /**
     * @hidden
     * Construct an instance of a DragonchainClient. THIS SHOULD NOT BE CALLED DIRECTLY. Instead use the `createClient` function to instantiate a client
     */
    constructor(endpoint: string, credentials: CredentialService, verify: boolean, injected?: any);
    /**
     * Reads secrets provided to a smart contract
     *
     * Note: This will only work when running within a smart contract, given that the smart contract was created/updated with secrets
     */
    getSmartContractSecret: (options: {
        /**
         * the name of the secret to retrieve for smart contract
         */
        secretName: string;
    }) => Promise<string>;
    /**
     * Get the status of your dragonchain
     */
    getStatus: () => Promise<Response<L1DragonchainStatusResult>>;
    /**
     * Get a transaction by id
     */
    getTransaction: (options: {
        /**
         * the transaction id of the transaction to get
         */
        transactionId: string;
    }) => Promise<Response<L1DragonchainTransactionFull>>;
    /**
     * Generate a new HMAC API key
     */
    createApiKey: (options?: {
        /**
         * nickname for the newly created key
         */
        nickname?: string | undefined;
    }) => Promise<Response<CreateAPIKeyResponse>>;
    /**
     * List HMAC API key IDs and their associated metadata
     */
    listApiKeys: () => Promise<Response<ListAPIKeyResponse>>;
    /**
     * Get metadata about an existing HMAC API key
     */
    getApiKey: (options: {
        /**
         * the key id of the key to get
         */
        keyId: string;
    }) => Promise<Response<GetAPIKeyResponse>>;
    /**
     * Delete an existing HMAC API key
     */
    deleteApiKey: (options: {
        /**
         * the key id of the key to delete
         */
        keyId: string;
    }) => Promise<Response<DeleteAPIKeyResponse>>;
    /**
     * Update nickname of existing HMAC API key
     */
    updateApiKey: (options: {
        /**
         * Key ID to modify
         */
        keyId: string;
        /**
         * New nickname to set for key
         */
        nickname: string;
    }) => Promise<Response<SimpleResponse>>;
    /**
     * Create a new Transaction on your Dragonchain.
     *
     * This transaction, if properly structured, will be received by your dragonchain, hashed, and put into a queue for processing into a block.
     *
     * A POST request is made to the callback URL when the transaction has settled into a block on the Blockchain.
     *
     * The `transaction_id` returned from this function can be used for checking the status of this transaction, including the block in which it was included.
     */
    createTransaction: (options: {
        /**
         * The transaction type to use for this new transaction. This transaction type must already exist on the chain (via `createTransactionType`)
         */
        transactionType: string;
        /**
         * Payload of the transaction. Must be a utf-8 encodable string, or any json object
         */
        payload?: string | object | undefined;
        /**
         * Tag of the transaction which gets indexed and can be searched on for queries
         */
        tag?: string | undefined;
        /**
         * URL to callback when this transaction is processed
         */
        callbackURL?: string | undefined;
    }) => Promise<Response<DragonchainTransactionCreateResponse>>;
    /**
     * Create a bulk transaction to send many transactions to a chain with only a single call
     */
    createBulkTransaction: (options: {
        transactionList: BulkTransactionPayload[];
    }) => Promise<Response<DragonchainBulkTransactionCreateResponse>>;
    /**
     * Query transactions using Redisearch query-string syntax
     *
     * For more information on how to use the Redisearch query-string syntax checkout their documentation:
     * https://oss.redislabs.com/redisearch/Query_Syntax.html
     *
     * Note that transactions have the following fields:
     * timestamp - sortable Numeric field
     * block_id - sortable Numeric field
     * tag - Text field
     *
     * Transaction types can also have additional custom fields if specified when creating the relevant transaction type/smart contract
     *
     * @example
     * ```javascript
     * myClient.queryTransactions({transactionType: 'example', redisearchQuery: 'somethingInTxnTag', sortBy: 'timestamp'}).then( ...do stuff )
     * ```
     */
    queryTransactions: (options: {
        /**
         * The single transaction type to query
         */
        transactionType: string;
        /**
         * Redisearch query syntax string to search with
         * https://oss.redislabs.com/redisearch/Query_Syntax.html
         * @example
         * word1|word2
         */
        redisearchQuery: string;
        /**
         * Whether or not to use redisearch's VERBATIM
         * (if true, no stemming occurs on the query)
         */
        verbatim?: boolean | undefined;
        /**
         * Pagination offset of query (default 0)
         * Must be an integer
         */
        offset?: number | undefined;
        /**
         * Pagination limit (default 10)
         * Must be an integer
         */
        limit?: number | undefined;
        /**
         * The name of the field to sort by
         */
        sortBy?: string | undefined;
        /**
         * If sortBy is set, this sorts the results by that field in ascending order
         * (descending if false)
         */
        sortAscending?: boolean | undefined;
        /**
         * If true, rather than an array of transaction objects,
         * it will return an array of transaction id strings instead
         */
        idsOnly?: boolean | undefined;
    }) => Promise<Response<QueryResult<L1DragonchainTransactionFull>>>;
    /**
     * Get a single block by ID
     */
    getBlock: (options: {
        /**
         * ID of the block to fetch
         */
        blockId: string;
    }) => Promise<Response<BlockSchemaType>>;
    /**
     * Query transactions using Redisearch query-string syntax
     *
     * For more information on how to use the Redisearch query-string syntax checkout their documentation:
     * https://oss.redislabs.com/redisearch/Query_Syntax.html
     *
     * Note that blocks have the following fields:
     * block_id - sortable Numeric field
     * timestamp - sortable Numeric field
     * prev_id - sortable Numeric field
     *
     * @example
     * ```javascript
     * myClient.queryBlocks({redisearchQuery: '*', sortBy: 'block_id'}).then( ...do stuff )
     * ```
     */
    queryBlocks: (options: {
        /**
         * Redisearch query syntax string to search with
         * https://oss.redislabs.com/redisearch/Query_Syntax.html
         * @example
         * word1|word2
         */
        redisearchQuery: string;
        /**
         * Pagination offset of query (default 0)
         * Must be an integer
         */
        offset?: number | undefined;
        /**
         * Pagination limit (default 10)
         * Must be an integer
         */
        limit?: number | undefined;
        /**
         * The name of the field to sort by
         */
        sortBy?: string | undefined;
        /**
         * If sortBy is set, this sorts the results by that field in ascending order
         * (descending if false)
         */
        sortAscending?: boolean | undefined;
        /**
         * If true, rather than an array of block objects,
         * it will return an array of block id strings instead
         */
        idsOnly?: boolean | undefined;
    }) => Promise<Response<QueryResult<BlockSchemaType>>>;
    /**
     * Create a new Smart Contract on your Dragonchain
     */
    createSmartContract: (options: {
        /**
         * Transaction type to assign to this new smart contract
         *
         * Must not already exist as a transaction type on the chain
         */
        transactionType: string;
        /**
         * Docker image to use with the smart contract. Should be in the form registry/image:tag (or just image:tag if it's a docker hub image)
         * @example quay.io/coreos/awscli:latest
         * @example alpine:3.9
         */
        image: string;
        /**
         * The command to run in your docker container for your application
         * @example echo
         */
        cmd: string;
        /**
         * The list of arguments to use in conjunction with cmd
         * @example ['input', 'that', 'will', 'be', 'passed', 'in', 'as', 'args', 'to', 'cmd']
         */
        args?: string[] | undefined;
        /**
         * The execution of the smart contract, can be `serial` or `parallel`. Will default to `parallel`
         *
         * If running in serial, the contract will be queued and executed in order, only one at a time
         *
         * If running in parallel, the contract will be executed as soon as possible after invocation, potentially out of order, and many at a time
         */
        executionOrder?: "parallel" | "serial" | undefined;
        /**
         * JSON object key-value pairs of strings for environments variables provided to the smart contract on execution
         * @example
         * ```javascript
         *
         * { MY_CUSTOM_ENV_VAR: "my_custom_env_value" }
         * ```
         */
        environmentVariables?: object | undefined;
        /**
         * JSON object key-value pairs of strings for secrets provided to the smart contract on execution
         *
         * These are more securely stored than environment variables, and can be accessed during execution the smart contract by using the `getSmartContractSecret` method of the sdk
         * @example
         * ```javascript
         *
         * { MY_SECRET: "some secret special data" }
         * ```
         */
        secrets?: object | undefined;
        /**
         * Schedule a smart contract to be automatically executed every `x` seconds
         *
         * For example: if `10` is supplied, then this contract will be automatically invoked and create a transaction once every 10 seconds
         *
         * This value should be a whole integer, and not a decimal
         *
         * Note: This is a mutually exclusive parameter with cronExpression
         */
        scheduleIntervalInSeconds?: number | undefined;
        /**
         * Schedule a smart contract to be automatically executed on a cadence via a cron expression
         *
         * Note: This is a mutually exclusive parameter with scheduleIntervalInSeconds
         * @example `* * * * *` This will invoke the contract automatically every minute, on the minute
         */
        cronExpression?: string | undefined;
        /**
         * The basic-auth credentials necessary to pull the docker container.
         *
         * This should be a base64-encoded string of `username:password` for the docker registry
         * @example ZXhhbXBsZVVzZXI6ZXhhbXBsZVBhc3N3b3JkCg==
         */
        registryCredentials?: string | undefined;
        /**
         * The custom indexes that should be associated with the transaction type for this smart contract
         */
        customIndexFields?: TransactionTypeCustomIndex[] | undefined;
    }) => Promise<Response<SmartContractAtRest>>;
    /**
     * Update an existing Smart Contract on your Dragonchain
     *
     * Note that all parameters (aside from contract id) are optional, and only supplied parameters will be updated
     */
    updateSmartContract: (options: {
        /**
         * Smart contract id of which to update. Should be a guid
         */
        smartContractId: string;
        /**
         * Docker image to use with the smart contract. Should be in the form registry/image:tag (or just image:tag if it's a docker hub image)
         * @example quay.io/coreos/awscli:latest
         * @example alpine:3.9
         */
        image?: string | undefined;
        /**
         * The command to run in your docker container for your application
         * @example echo
         */
        cmd?: string | undefined;
        /**
         * The list of arguments to use in conjunction with cmd
         * @example ['input', 'that', 'will', 'be', 'passed', 'in', 'as', 'args', 'to', 'cmd']
         */
        args?: string[] | undefined;
        /**
         * The execution of the smart contract, can be `serial` or `parallel`. Will default to `parallel`
         *
         * If running in serial, the contract will be queued and executed in order, only one at a time
         *
         * If running in parallel, the contract will be executed as soon as possible after invocation, potentially out of order, and many at a time
         */
        executionOrder?: "parallel" | "serial" | undefined;
        /**
         * Boolean whether or not the contract should be enabled, and able to be invoked
         */
        enabled?: boolean | undefined;
        /**
         * JSON object key-value pairs of strings for environments variables provided to the smart contract on execution
         * @example
         * ```javascript
         *
         * { MY_CUSTOM_ENV_VAR: "my_custom_env_value" }
         * ```
         */
        environmentVariables?: object | undefined;
        /**
         * JSON object key-value pairs of strings for secrets provided to the smart contract on execution
         *
         * These are more securely stored than environment variables, and can be accessed during execution the smart contract by using the `getSmartContractSecret` method of the sdk
         * @example
         * ```javascript
         *
         * { MY_SECRET: "some secret special data" }
         * ```
         */
        secrets?: object | undefined;
        /**
         * Schedule a smart contract to be automatically executed every `x` seconds
         *
         * For example, if `10` is supplied, then this contract will be automatically invoked and create a transaction once every 10 seconds
         *
         * This value should be a whole integer, and not a decimal
         *
         * Note: This is a mutually exclusive parameter with cronExpression
         */
        scheduleIntervalInSeconds?: number | undefined;
        /**
         * Schedule a smart contract to be automatically executed on a cadence via a cron expression
         *
         * Note: This is a mutually exclusive parameter with scheduleIntervalInSeconds
         *
         * @example `* * * * *` This will invoke the contract automatically every minute, on the minute
         */
        cronExpression?: string | undefined;
        /**
         * The basic-auth credentials necessary to pull the docker container.
         *
         * This should be a base64-encoded string of `username:password` for the docker registry
         *
         * @example ZXhhbXBsZVVzZXI6ZXhhbXBsZVBhc3N3b3JkCg==
         */
        registryCredentials?: string | undefined;
        /**
         * Set true to remove the existing scheduleIntervalInSeconds or cronExpression from the contract
         */
        disableSchedule?: boolean | undefined;
    }) => Promise<Response<SmartContractAtRest>>;
    /**
     * Deletes a deployed smart contract
     */
    deleteSmartContract: (options: {
        /**
         * The id of the smart contract to delete. Should be a guid
         */
        smartContractId: string;
    }) => Promise<Response<SimpleResponse>>;
    /**
     * Get a single smart contract by one of id or transaction type
     */
    getSmartContract: (options: {
        /**
         * Contract id to get, mutually exclusive with transactionType
         */
        smartContractId?: string | undefined;
        /**
         * Transaction id of smart contract to get, mutually exclusive with smartContractId
         */
        transactionType?: string | undefined;
    }) => Promise<Response<SmartContractAtRest>>;
    /**
     * Get a single smart contract by one of id or transaction type
     */
    getSmartContractLogs: (options: {
        /**
         * Contract id to get logs from
         */
        smartContractId: string;
        /**
         * Tail, the maximum number of logs to return (unsigned integer)
         */
        tail?: number | undefined;
        /**
         * RFC3339 timestamp string. Returns all logs since this datetime string
         */
        since?: string | undefined;
    }) => Promise<Response<SmartContractLogs>>;
    /**
     * Get all smart contracts on a chain
     */
    listSmartContracts: () => Promise<Response<SmartContractList>>;
    /**
     * Get chain ids for the pending verifications for a block. Note that this is only relevant for level 1 chains.
     */
    getPendingVerifications: (options: {
        /**
         * The block ID to retrieve pending verifications for
         */
        blockId: string;
    }) => Promise<Response<PendingVerifications>>;
    /**
     * Get verifications for a block. Note that this is only relevant for level 1 chains
     */
    getVerifications: (options: {
        /**
         * The block ID to retrieve verifications for
         */
        blockId: string;
        /**
         * The level of verifications to retrieve (2-5). If not supplied, all levels are returned
         */
        level?: number | undefined;
    }) => Promise<Response<levelVerifications> | Response<Verifications>>;
    /**
     * Get an object from the smart contract heap. This is used for getting stateful data set by the outputs of smart contracts
     */
    getSmartContractObject: (options: {
        /**
         * Key of the object to retrieve
         */
        key: string;
        /**
         * Id of the smart contract from which to get the object
         *
         * When running from within a smart contract, this is provided via the SMART_CONTRACT_ID environment variable, and doesn't need to be explicitly provided
         */
        smartContractId?: string | undefined;
    }) => Promise<any>;
    /**
     * List objects from a folder within the heap of a smart contract
     */
    listSmartContractObjects: (options?: {
        /**
         * The folder to list from the heap. Please note this CANNOT end in a '/'
         *
         * If nothing is provided, it will list at the root of the heap
         * @example folder1
         * @example folder1/subFolder
         */
        prefixKey?: string | undefined;
        /**
         * Smart contract to list the objects from
         *
         * When running from within a smart contract, this is provided via the SMART_CONTRACT_ID environment variable, and doesn't need to be explicitly provided
         */
        smartContractId?: string | undefined;
    }) => Promise<any>;
    /**
     * Create a new transaction type for ledgering transactions
     */
    createTransactionType: (options: {
        /**
         * The string of the transaction type to create
         * @example cust1
         */
        transactionType: string;
        /**
         * The custom indexes that should be associated with this transaction type
         */
        customIndexFields?: TransactionTypeCustomIndex[] | undefined;
    }) => Promise<Response<SimpleResponse>>;
    /**
     * Deletes an existing registered transaction type
     */
    deleteTransactionType: (options: {
        /**
         * The name of the transaction type to delete
         */
        transactionType: string;
    }) => Promise<Response<SimpleResponse>>;
    /**
     * Lists currently created transaction types
     */
    listTransactionTypes: () => Promise<Response<TransactionTypeListResponse>>;
    /**
     * Gets an existing transaction type from the chain
     */
    getTransactionType: (options: {
        /**
         * The name of the transaction type to get
         */
        transactionType: string;
    }) => Promise<Response<TransactionTypeResponse>>;
    /**
     * Create (or overwrite) a bitcoin wallet/network for interchain use
     */
    createBitcoinInterchain: (options: {
        /**
         * The name of the network to update
         */
        name: string;
        /**
         * Whether or not this is a testnet wallet/address (not required if providing privateKey as WIF)
         */
        testnet?: boolean | undefined;
        /**
         * The base64 encoded private key, or WIF for the desired wallet
         */
        privateKey?: string | undefined;
        /**
         * The endpoint of the bitcoin core RPC node to use (i.e. http://my-node:8332)
         */
        rpcAddress?: string | undefined;
        /**
         * The base64-encoded username:password for the rpc node. For example, user: a pass: b would be 'YTpi' (base64("a:b"))
         */
        rpcAuthorization?: string | undefined;
        /**
         * Whether or not to force a utxo-rescan for the address.
         * If using a new private key for an existing wallet with funds, this must be true to use its existing funds
         */
        utxoScan?: boolean | undefined;
    }) => Promise<Response<BitcoinInterchainNetwork>>;
    /**
     * Update an existing bitcoin wallet/network for interchain use. Will only update the provided fields
     */
    updateBitcoinInterchain: (options: {
        /**
         * The name of the network to update
         */
        name: string;
        /**
         * Whether or not this is a testnet wallet/address (not required if providing privateKey as WIF)
         */
        testnet?: boolean | undefined;
        /**
         * The base64 encoded private key, or WIF for the desired wallet
         */
        privateKey?: string | undefined;
        /**
         * The endpoint of the bitcoin core RPC node to use (i.e. http://my-node:8332)
         */
        rpcAddress?: string | undefined;
        /**
         * The base64-encoded username:password for the rpc node. For example, user: a pass: b would be 'YTpi' (base64("a:b"))
         */
        rpcAuthorization?: string | undefined;
        /**
         * Whether or not to force a utxo-rescan for the address.
         * If using a new private key for an existing wallet with funds, this must be true to use its existing funds
         */
        utxoScan?: boolean | undefined;
    }) => Promise<Response<BitcoinInterchainNetwork>>;
    /**
     * Sign a transaction for a bitcoin network on the chain
     */
    signBitcoinTransaction: (options: {
        /**
         * The name of the bitcoin network to use for signing
         */
        name: string;
        /**
         * The desired fee in satoshis/byte. Must be an integer
         *
         * If not supplied, an estimate will be automatically generated
         */
        satoshisPerByte?: number | undefined;
        /**
         * String data to embed in the transaction as null-data output type
         */
        data?: string | undefined;
        /**
         * Change address to use for this transaction. If not supplied, this will be the source address
         */
        changeAddress?: string | undefined;
        /**
         * The desired bitcoin outputs to create for this transaction
         */
        outputs?: BitcoinTransactionOutputs[] | undefined;
    }) => Promise<Response<PublicBlockchainTransactionResponse>>;
    /**
     * Create (or overwrite) an ethereum wallet/network for interchain use
     */
    createEthereumInterchain: (options: {
        /**
         * The name of the network to update
         */
        name: string;
        /**
         * The base64 or hex encoded private key to use. Will automatically generate a random one if not provided
         */
        privateKey?: string | undefined;
        /**
         * The endpoint of the ethereum RPC node to use (i.e. http://my-node:8545)
         */
        rpcAddress?: string | undefined;
        /**
         * The ethereum chain id to use. Will automatically derive this if providing a custom rpcAddress. This should be an integer.
         * Without providing a custom rpcAddress, Dragonchain manages and supports: 1=ETH Mainnet|3=ETH Ropsten|61=ETC Mainnet|62=ETC Morden
         */
        chainId?: number | undefined;
    }) => Promise<Response<EthereumInterchainNetwork>>;
    /**
     * Update an existing ethereum wallet/network for interchain use
     */
    updateEthereumInterchain: (options: {
        /**
         * The name of the network to update
         */
        name: string;
        /**
         * The base64 or hex encoded private key to use. Will automatically generate a random one if not provided
         */
        privateKey?: string | undefined;
        /**
         * The endpoint of the ethereum RPC node to use (i.e. http://my-node:8545)
         */
        rpcAddress?: string | undefined;
        /**
         * The ethereum chain id to use. Will automatically derive this if providing a custom rpcAddress. This should be an integer.
         * Without providing a custom rpcAddress, Dragonchain manages and supports: 1=ETH Mainnet|3=ETH Ropsten|61=ETC Mainnet|2=ETC Morden
         */
        chainId?: number | undefined;
    }) => Promise<Response<EthereumInterchainNetwork>>;
    /**
     * Create and sign an ethereum transaction using your chain's interchain network
     */
    signEthereumTransaction: (options: {
        /**
         * The name of the ethereum network to use for signing
         */
        name: string;
        /**
         * The (hex-encoded) address to send the transaction to
         */
        to: string;
        /**
         * The (hex-encoded) number of wei to send with this transaction
         */
        value: string;
        /**
         * The (hex-encoded) string of extra data to include with this transaction
         */
        data?: string | undefined;
        /**
         * The (hex-encoded) gas price in gwei to pay. If not supplied, this will be estimated automatically
         */
        gasPrice?: string | undefined;
        /**
         * The (hex-encoded) gas limit for this transaction. If not supplied, this will be estimated automatically
         */
        gas?: string | undefined;
        /**
         * The (hex-encoded) nonce for this transaction. If not supplied, it will be fetched automatically
         */
        nonce?: string | undefined;
    }) => Promise<Response<PublicBlockchainTransactionResponse>>;
    /**
     * Get a configured interchain network/wallet from the chain
     */
    getInterchainNetwork: (options: {
        /**
         * The blockchain type to get (i.e. 'bitcoin', 'ethereum')
         */
        blockchain: SupportedInterchains;
        /**
         * The name of that blockchain's network (set when creating the network)
         */
        name: string;
    }) => Promise<Response<EthereumInterchainNetwork | BitcoinInterchainNetwork>>;
    /**
     * Delete an interchain network/wallet from the chain
     */
    deleteInterchainNetwork: (options: {
        /**
         * The blockchain type to delete (i.e. 'bitcoin', 'ethereum')
         */
        blockchain: SupportedInterchains;
        /**
         * The name of that blockchain's network (set when creating the network)
         */
        name: string;
    }) => Promise<Response<SimpleResponse>>;
    /**
     * List all the interchain network/wallets for a blockchain type
     */
    listInterchainNetworks: (options: {
        /**
         * The blockchain type to get (i.e. 'bitcoin', 'ethereum')
         */
        blockchain: SupportedInterchains;
    }) => Promise<Response<InterchainNetworkList>>;
    /**
     * Set the default interchain network for the chain to use (L5 Only)
     */
    setDefaultInterchainNetwork: (options: {
        /**
         * The blockchain type to set (i.e. 'bitcoin', 'ethereum')
         */
        blockchain: SupportedInterchains;
        /**
         * The name of that blockchain's network to use (set when creating the network)
         */
        name: string;
    }) => Promise<Response<EthereumInterchainNetwork | BitcoinInterchainNetwork>>;
    /**
     * Get the set default interchain network for this chain (L5 Only)
     */
    getDefaultInterchainNetwork: () => Promise<Response<EthereumInterchainNetwork | BitcoinInterchainNetwork>>;
    /**
     * !This method is deprecated and should not be used!
     * Backwards compatibility will exist for legacy chains, but will not work on new chains. listInterchainNetworks should be used instead
     *
     * Gets a list of the chain's interchain addresses
     */
    getPublicBlockchainAddresses: () => Promise<Response<PublicBlockchainAddressListResponse>>;
    /**
     * !This method is deprecated and should not be used!
     * Backwards compatibility will exist for legacy chains, but will not work on new chains. signBitcoinTransaction should be used instead
     *
     * Sign a transaction for a bitcoin network
     */
    createBitcoinTransaction: (options: {
        /**
         * The bitcoin network that the transaction is for (mainnet or testnet)
         */
        network: "BTC_MAINNET" | "BTC_TESTNET3";
        /**
         * The desired fee in satoshis/byte. Must be an integer
         *
         * If not supplied, an estimate will be automatically generated
         */
        satoshisPerByte?: number | undefined;
        /**
         * String data to embed in the transaction as null-data output type
         */
        data?: string | undefined;
        /**
         * Change address to use for this transaction. If not supplied, this will be the source address
         */
        changeAddress?: string | undefined;
        /**
         * The desired bitcoin outputs to create for this transaction
         */
        outputs?: BitcoinTransactionOutputs[] | undefined;
    }) => Promise<Response<PublicBlockchainTransactionResponse>>;
    /**
     * !This method is deprecated and should not be used!
     * Backwards compatibility will exist for legacy chains, but will not work on new chains. signEthereumTransaction should be used instead
     *
     * Sign a transaction for an ethereum network
     */
    createEthereumTransaction: (options: {
        /**
         * The ethereum network that the transaction is for (ETH/ETC mainnet or testnet)
         */
        network: "ETH_MAINNET" | "ETH_ROPSTEN" | "ETC_MAINNET" | "ETC_MORDEN";
        /**
         * The (hex-encoded) address to send the transaction to
         */
        to: string;
        /**
         * The (hex-encoded) number of wei to send with this transaction
         */
        value: string;
        /**
         * The (hex-encoded) string of extra data to include with this transaction
         */
        data?: string | undefined;
        /**
         * The (hex-encoded) gas price in gwei to pay. If not supplied, this will be estimated automatically
         */
        gasPrice?: string | undefined;
        /**
         * The (hex-encoded) gas limit for this transaction. If not supplied, this will be estimated automatically
         */
        gas?: string | undefined;
    }) => Promise<Response<PublicBlockchainTransactionResponse>>;
    /**
     * @hidden
     */
    getTimestamp(): string;
    /**
     * @hidden
     */
    private get;
    /**
     * @hidden
     */
    private post;
    /**
     * @hidden
     */
    private put;
    /**
     * @hidden
     */
    private patch;
    /**
     * @hidden
     */
    private delete;
    /**
     * @hidden
     */
    private validateAndBuildCustomIndexFieldsArray;
    /**
     * @hidden
     */
    private generateQueryString;
    /**
     * @hidden
     */
    private getFetchOptions;
    /**
     * @hidden
     * For development purposes only! NodeJS naturally distrusts self signed certs (for good reason!). This function allows users the option to "not care" about self signed certs.
     * @param {function} asyncFunction an async function to call while NODE_TLS_REJECT_UNAUTHORIZED is quickly toggled from "1" to "0" and back to "1"
     */
    private toggleSslCertVerification;
    /**
     * @hidden
     */
    private makeRequest;
}
/**
 * Create and return an instantiation of a dragonchain client
 */
export declare const createClient: (options?: {
    /**
     * DragonchainId for this client. Not necessary if DRAGONCHAIN_ID env var is set, or if default is set in config file
     */
    dragonchainId?: string | undefined;
    /**
     * AuthKeyId to explicitly use with this client. Must be set along with authKey or it will be ignored
     */
    authKeyId?: string | undefined;
    /**
     * AuthKey to explicitly use with this client. Must be set along with authKeyId or it will be ignored
     */
    authKey?: string | undefined;
    /**
     * Endpoint to explicitly use with this client. Should not have a trailing slash and look something like https://some.url
     */
    endpoint?: string | undefined;
    /**
     * Whether or not to verify the https certificate for https connections. Defaults to true if not provided
     */
    verify?: boolean | undefined;
    /**
     * The hmac algorithm to use when generating authenticated requests. Defaults to SHA256
     */
    algorithm?: "SHA256" | "SHA3-256" | "BLAKE2b512" | undefined;
}) => Promise<DragonchainClient>;

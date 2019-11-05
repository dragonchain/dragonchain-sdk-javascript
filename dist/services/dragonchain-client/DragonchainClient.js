"use strict";
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("util");
var fs = require("fs");
var path = require("path");
var node_fetch_1 = require("node-fetch");
var glob = require("glob");
var CredentialService_1 = require("../credential-service/CredentialService");
var config_service_1 = require("../config-service");
var url_1 = require("url");
var index_1 = require("../../index");
var FailureByDesign_1 = require("../../errors/FailureByDesign");
var globPromise = util_1.promisify(glob);
/**
 * @hidden
 */
var UrlSearchParams = function (queryParams) {
    if (!url_1.URLSearchParams) {
        return new URLSearchParams(queryParams); // used in browser ( method on window )
    }
    return new url_1.URLSearchParams(queryParams); // used in node
};
var readFileAsync = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
    return [2 /*return*/, ''];
}); }); };
if (fs.readFile)
    readFileAsync = util_1.promisify(fs.readFile);
/**
 * HTTP Client that interfaces with the dragonchain api
 */
var DragonchainClient = /** @class */ (function () {
    /**
     * @hidden
     * Construct an instance of a DragonchainClient. THIS SHOULD NOT BE CALLED DIRECTLY. Instead use the `createClient` function to instantiate a client
     */
    function DragonchainClient(endpoint, credentials, verify, injected) {
        var _this = this;
        if (injected === void 0) { injected = {}; }
        /**
         * Reads secrets provided to a smart contract
         *
         * Note: This will only work when running within a smart contract, given that the smart contract was created/updated with secrets
         */
        this.getSmartContractSecret = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var secretPath;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.secretName)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `secretName` is required');
                        secretPath = path.join('/', 'var', 'openfaas', 'secrets', "sc-" + process.env.SMART_CONTRACT_ID + "-" + options.secretName);
                        return [4 /*yield*/, this.readFileAsync(secretPath, 'utf-8')];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        /**
         * Get the status of your dragonchain
         */
        this.getStatus = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.get('/v1/status')];
                case 1: return [2 /*return*/, (_a.sent())];
            }
        }); }); };
        /**
         * Get a transaction by id
         */
        this.getTransaction = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.transactionId)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `transactionId` is required');
                        return [4 /*yield*/, this.get("/v1/transaction/" + options.transactionId)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        /**
         * Generate a new HMAC API key
         */
        this.createApiKey = function (options) {
            if (options === void 0) { options = {}; }
            return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var body;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            body = {};
                            if (options.nickname)
                                body['nickname'] = options.nickname;
                            return [4 /*yield*/, this.post('/v1/api-key', body)];
                        case 1: return [2 /*return*/, (_a.sent())];
                    }
                });
            });
        };
        /**
         * List HMAC API key IDs and their associated metadata
         */
        this.listApiKeys = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get('/v1/api-key')];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        /**
         * Get metadata about an existing HMAC API key
         */
        this.getApiKey = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.keyId)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `keyId` is required');
                        return [4 /*yield*/, this.get("/v1/api-key/" + options.keyId)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        /**
         * Delete an existing HMAC API key
         */
        this.deleteApiKey = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.keyId)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `keyId` is required');
                        return [4 /*yield*/, this.delete("/v1/api-key/" + options.keyId)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        /**
         * Update nickname of existing HMAC API key
         */
        this.updateApiKey = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.keyId || !options.nickname)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `keyId` and `nickname` are required');
                        return [4 /*yield*/, this.put("/v1/api-key/" + options.keyId, { nickname: options.nickname })];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        /**
         * Create a new Transaction on your Dragonchain.
         *
         * This transaction, if properly structured, will be received by your dragonchain, hashed, and put into a queue for processing into a block.
         *
         * A POST request is made to the callback URL when the transaction has settled into a block on the Blockchain.
         *
         * The `transaction_id` returned from this function can be used for checking the status of this transaction, including the block in which it was included.
         */
        this.createTransaction = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var transactionBody;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.transactionType)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `transactionType` is required');
                        if (!options.payload)
                            options.payload = ''; // default payload to an empty string if not provided
                        transactionBody = {
                            version: '1',
                            txn_type: options.transactionType,
                            payload: options.payload
                        };
                        if (options.tag)
                            transactionBody.tag = options.tag;
                        return [4 /*yield*/, this.post('/v1/transaction', transactionBody, options.callbackURL)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        /**
         * Create a bulk transaction to send many transactions to a chain with only a single call
         */
        this.createBulkTransaction = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var bulkTransactionBody;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.transactionList)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'parameter `transactionList` is required');
                        bulkTransactionBody = [];
                        options.transactionList.forEach(function (transaction) {
                            var singleBody = {
                                version: '1',
                                txn_type: transaction.transactionType,
                                payload: transaction.payload || ''
                            };
                            if (transaction.tag)
                                singleBody.tag = transaction.tag;
                            bulkTransactionBody.push(singleBody);
                        });
                        return [4 /*yield*/, this.post("/v1/transaction_bulk", bulkTransactionBody)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
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
        this.queryTransactions = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var queryParams;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryParams = {
                            transaction_type: options.transactionType,
                            q: options.redisearchQuery,
                            offset: options.offset || 0,
                            limit: options.limit || 10
                        };
                        if (options.verbatim !== undefined)
                            queryParams.verbatim = options.verbatim;
                        if (options.idsOnly !== undefined)
                            queryParams.id_only = options.idsOnly;
                        if (options.sortBy !== undefined) {
                            queryParams.sort_by = options.sortBy;
                            if (options.sortAscending !== undefined)
                                queryParams.sort_asc = options.sortAscending;
                        }
                        return [4 /*yield*/, this.get("/v1/transaction" + this.generateQueryString(queryParams))];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        /**
         * Get a single block by ID
         */
        this.getBlock = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.blockId)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `blockId` is required');
                        return [4 /*yield*/, this.get("/v1/block/" + options.blockId)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
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
        this.queryBlocks = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var queryParams;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryParams = {
                            q: options.redisearchQuery,
                            offset: options.offset || 0,
                            limit: options.limit || 10
                        };
                        if (options.idsOnly !== undefined)
                            queryParams.id_only = options.idsOnly;
                        if (options.sortBy !== undefined) {
                            queryParams.sort_by = options.sortBy;
                            if (options.sortAscending !== undefined)
                                queryParams.sort_asc = options.sortAscending;
                        }
                        return [4 /*yield*/, this.get("/v1/block" + this.generateQueryString(queryParams))];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        /**
         * Create a new Smart Contract on your Dragonchain
         */
        this.createSmartContract = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var body;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.transactionType)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `transactionType` is required');
                        if (!options.image)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `image` is required');
                        if (!options.cmd)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `cmd` is required');
                        if (options.scheduleIntervalInSeconds && options.cronExpression)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameters `scheduleIntervalInSeconds` and `cronExpression` are mutually exclusive');
                        body = {
                            version: '3',
                            txn_type: options.transactionType,
                            image: options.image,
                            execution_order: 'parallel',
                            cmd: options.cmd
                        };
                        if (options.args)
                            body.args = options.args;
                        if (options.executionOrder)
                            body.execution_order = options.executionOrder;
                        if (options.environmentVariables)
                            body.env = options.environmentVariables;
                        if (options.secrets)
                            body.secrets = options.secrets;
                        if (options.scheduleIntervalInSeconds)
                            body.seconds = options.scheduleIntervalInSeconds;
                        if (options.cronExpression)
                            body.cron = options.cronExpression;
                        if (options.registryCredentials)
                            body.auth = options.registryCredentials;
                        if (options.customIndexFields)
                            body.custom_indexes = this.validateAndBuildCustomIndexFieldsArray(options.customIndexFields);
                        return [4 /*yield*/, this.post('/v1/contract', body)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        /**
         * Update an existing Smart Contract on your Dragonchain
         *
         * Note that all parameters (aside from contract id) are optional, and only supplied parameters will be updated
         */
        this.updateSmartContract = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var body;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.smartContractId)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `smartContractId` is required');
                        if (options.scheduleIntervalInSeconds && options.cronExpression)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameters `scheduleIntervalInSeconds` and `cronExpression` are mutually exclusive');
                        body = {
                            version: '3'
                        };
                        if (options.image)
                            body.image = options.image;
                        if (options.cmd)
                            body.cmd = options.cmd;
                        if (options.args)
                            body.args = options.args;
                        if (options.executionOrder)
                            body.execution_order = options.executionOrder;
                        if (options.enabled === true)
                            body.desired_state = 'active';
                        if (options.enabled === false)
                            body.desired_state = 'inactive';
                        if (options.environmentVariables)
                            body.env = options.environmentVariables;
                        if (options.secrets)
                            body.secrets = options.secrets;
                        if (options.scheduleIntervalInSeconds)
                            body.seconds = options.scheduleIntervalInSeconds;
                        if (options.cronExpression)
                            body.cron = options.cronExpression;
                        if (options.registryCredentials)
                            body.auth = options.registryCredentials;
                        if (options.disableSchedule)
                            body.disable_schedule = true;
                        return [4 /*yield*/, this.put("/v1/contract/" + options.smartContractId, body)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        /**
         * Deletes a deployed smart contract
         */
        this.deleteSmartContract = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.smartContractId)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `smartContractId` is required');
                        return [4 /*yield*/, this.delete("/v1/contract/" + options.smartContractId)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        /**
         * Get a single smart contract by one of id or transaction type
         */
        this.getSmartContract = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (options.smartContractId && options.transactionType)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Only one of `smartContractId` or `transactionType` can be specified');
                        if (!options.smartContractId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.get("/v1/contract/" + options.smartContractId)];
                    case 1: return [2 /*return*/, (_a.sent())];
                    case 2:
                        if (!options.transactionType) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.get("/v1/contract/txn_type/" + options.transactionType)];
                    case 3: return [2 /*return*/, (_a.sent())];
                    case 4: throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'At least one of `smartContractId` or `transactionType` must be supplied');
                }
            });
        }); };
        /**
         * Get a single smart contract by one of id or transaction type
         */
        this.getSmartContractLogs = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var queryParameters;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.smartContractId)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `smartContractId` is required');
                        queryParameters = {};
                        if (options.tail)
                            queryParameters.tail = options.tail;
                        if (options.since)
                            queryParameters.since = options.since;
                        return [4 /*yield*/, this.get("/v1/contract/" + options.smartContractId + "/logs" + this.generateQueryString(queryParameters))];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        /**
         * Get all smart contracts on a chain
         */
        this.listSmartContracts = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.get('/v1/contract')];
                case 1: return [2 /*return*/, (_a.sent())];
            }
        }); }); };
        /**
         * Get chain ids for the pending verifications for a block. Note that this is only relevant for level 1 chains.
         */
        this.getPendingVerifications = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.blockId)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `blockId` is required');
                        return [4 /*yield*/, this.get("/v1/verifications/pending/" + options.blockId)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        /**
         * Get verifications for a block. Note that this is only relevant for level 1 chains
         */
        this.getVerifications = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.blockId)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `blockId` is required');
                        if (!options.level) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.get("/v1/verifications/" + options.blockId + "?level=" + options.level)];
                    case 1: return [2 /*return*/, (_a.sent())];
                    case 2: return [4 /*yield*/, this.get("/v1/verifications/" + options.blockId)];
                    case 3: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        /**
         * Get an object from the smart contract heap. This is used for getting stateful data set by the outputs of smart contracts
         */
        this.getSmartContractObject = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, e_1, response;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!options.key)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `key` is required');
                        if (!(process.env.DRAGONCHAIN_ENV === 'test')) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        _a = {
                            status: 200
                        };
                        return [4 /*yield*/, readFileAsync("/dragonchain/smartcontract/heap/" + options.key, 'utf-8')];
                    case 2: return [2 /*return*/, (_a.response = _b.sent(),
                            _a.ok = true,
                            _a)];
                    case 3:
                        e_1 = _b.sent();
                        // When not found, S3 returns null.
                        if (e_1.code === 'ENOENT') {
                            return [2 /*return*/, { status: 404, response: 'null', ok: false }];
                        }
                        throw e_1; // re-raise if unexpected error.
                    case 4:
                        if (!options.smartContractId) {
                            if (!process.env.SMART_CONTRACT_ID)
                                throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `smartContractId` is required when not running within a smart contract');
                            options.smartContractId = process.env.SMART_CONTRACT_ID;
                        }
                        return [4 /*yield*/, this.get("/v1/get/" + options.smartContractId + "/" + options.key, false)];
                    case 5:
                        response = (_b.sent());
                        return [2 /*return*/, response];
                }
            });
        }); };
        /**
         * List objects from a folder within the heap of a smart contract
         */
        this.listSmartContractObjects = function (options) {
            if (options === void 0) { options = {}; }
            return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var path, pattern;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!options.smartContractId) {
                                if (!process.env.SMART_CONTRACT_ID)
                                    throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `smartContractId` is required when not running within a smart contract');
                                options.smartContractId = process.env.SMART_CONTRACT_ID;
                            }
                            path = "/v1/list/" + options.smartContractId + "/";
                            if (options.prefixKey) {
                                if (options.prefixKey.endsWith('/'))
                                    throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', "Parameter `prefixKey` cannot end with '/'");
                                path += options.prefixKey + "/";
                            }
                            if (process.env.DRAGONCHAIN_ENV === 'test') {
                                pattern = options.prefixKey ? "/dragonchain/smartcontract/heap/" + options.prefixKey + "/**" : "/dragonchain/smartcontract/heap/**";
                                return [2 /*return*/, globPromise(pattern, { nodir: true })];
                            }
                            return [4 /*yield*/, this.get(path)];
                        case 1: return [2 /*return*/, (_a.sent())];
                    }
                });
            });
        };
        /**
         * Create a new transaction type for ledgering transactions
         */
        this.createTransactionType = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var body;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.transactionType)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `transactionType` is required');
                        body = {
                            version: '2',
                            txn_type: options.transactionType
                        };
                        if (options.customIndexFields)
                            body.custom_indexes = this.validateAndBuildCustomIndexFieldsArray(options.customIndexFields);
                        return [4 /*yield*/, this.post('/v1/transaction-type', body)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        /**
         * Deletes an existing registered transaction type
         */
        this.deleteTransactionType = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.transactionType)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `transactionType` is required');
                        return [4 /*yield*/, this.delete("/v1/transaction-type/" + options.transactionType)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        /**
         * Lists currently created transaction types
         */
        this.listTransactionTypes = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get('/v1/transaction-types')];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        /**
         * Gets an existing transaction type from the chain
         */
        this.getTransactionType = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.transactionType)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `transactionType` is required');
                        return [4 /*yield*/, this.get("/v1/transaction-type/" + options.transactionType)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        /**
         * Create (or overwrite) a bitcoin wallet/network for interchain use
         */
        this.createBitcoinInterchain = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var body;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.name)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `name` is required');
                        body = { version: '1', name: options.name };
                        if (typeof options.testnet === 'boolean')
                            body.testnet = options.testnet;
                        if (options.privateKey)
                            body.private_key = options.privateKey;
                        if (options.rpcAddress)
                            body.rpc_address = options.rpcAddress;
                        if (options.rpcAuthorization)
                            body.rpc_authorization = options.rpcAuthorization;
                        if (typeof options.utxoScan === 'boolean')
                            body.utxo_scan = options.utxoScan;
                        return [4 /*yield*/, this.post("/v1/interchains/bitcoin", body)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        /**
         * Update an existing bitcoin wallet/network for interchain use. Will only update the provided fields
         */
        this.updateBitcoinInterchain = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var body;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.name)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `name` is required');
                        body = { version: '1' };
                        if (typeof options.testnet === 'boolean')
                            body.testnet = options.testnet;
                        if (options.privateKey)
                            body.private_key = options.privateKey;
                        if (options.rpcAddress)
                            body.rpc_address = options.rpcAddress;
                        if (options.rpcAuthorization)
                            body.rpc_authorization = options.rpcAuthorization;
                        if (typeof options.utxoScan === 'boolean')
                            body.utxo_scan = options.utxoScan;
                        return [4 /*yield*/, this.patch("/v1/interchains/bitcoin/" + options.name, body)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        /**
         * Sign a transaction for a bitcoin network on the chain
         */
        this.signBitcoinTransaction = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var body;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.name)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `name` is required');
                        if (options.satoshisPerByte && !Number.isInteger(options.satoshisPerByte))
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `satoshisPerByte` must be an integer');
                        body = { version: '1' };
                        if (options.satoshisPerByte)
                            body.fee = options.satoshisPerByte;
                        if (options.data)
                            body.data = options.data;
                        if (options.changeAddress)
                            body.change = options.changeAddress;
                        if (options.outputs) {
                            body.outputs = [];
                            options.outputs.forEach(function (output) {
                                body.outputs.push({
                                    to: output.to,
                                    value: output.value
                                });
                            });
                        }
                        return [4 /*yield*/, this.post("/v1/interchains/bitcoin/" + options.name + "/transaction", body)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        /**
         * Create (or overwrite) an ethereum wallet/network for interchain use
         */
        this.createEthereumInterchain = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var body;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.name)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `name` is required');
                        if (options.chainId && !Number.isInteger(options.chainId))
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `chainId` must be an integer');
                        body = { version: '1', name: options.name };
                        if (options.privateKey)
                            body.private_key = options.privateKey;
                        if (options.rpcAddress)
                            body.rpc_address = options.rpcAddress;
                        if (options.chainId)
                            body.chain_id = options.chainId;
                        return [4 /*yield*/, this.post("/v1/interchains/ethereum", body)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        /**
         * Update an existing ethereum wallet/network for interchain use
         */
        this.updateEthereumInterchain = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var body;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.name)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `name` is required');
                        if (options.chainId && !Number.isInteger(options.chainId))
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `chainId` must be an integer');
                        body = { version: '1' };
                        if (options.privateKey)
                            body.private_key = options.privateKey;
                        if (options.rpcAddress)
                            body.rpc_address = options.rpcAddress;
                        if (options.chainId)
                            body.chain_id = options.chainId;
                        return [4 /*yield*/, this.patch("/v1/interchains/ethereum/" + options.name, body)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        /**
         * Create and sign an ethereum transaction using your chain's interchain network
         */
        this.signEthereumTransaction = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var body;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.name)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `name` is required');
                        if (!options.to)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `to` is required');
                        if (!options.value)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `value` is required');
                        body = {
                            version: '1',
                            to: options.to,
                            value: options.value
                        };
                        if (options.data)
                            body.data = options.data;
                        if (options.gasPrice)
                            body.gasPrice = options.gasPrice;
                        if (options.gas)
                            body.gas = options.gas;
                        if (options.nonce)
                            body.nonce = options.nonce;
                        return [4 /*yield*/, this.post("/v1/interchains/ethereum/" + options.name + "/transaction", body)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        /**
         * Get a configured interchain network/wallet from the chain
         */
        this.getInterchainNetwork = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.blockchain)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `blockchain` is required');
                        if (!options.name)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `name` is required');
                        return [4 /*yield*/, this.get("/v1/interchains/" + options.blockchain + "/" + options.name)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        /**
         * Delete an interchain network/wallet from the chain
         */
        this.deleteInterchainNetwork = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.blockchain)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `blockchain` is required');
                        if (!options.name)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `name` is required');
                        return [4 /*yield*/, this.delete("/v1/interchains/" + options.blockchain + "/" + options.name)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        /**
         * List all the interchain network/wallets for a blockchain type
         */
        this.listInterchainNetworks = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.blockchain)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `blockchain` is required');
                        return [4 /*yield*/, this.get("/v1/interchains/" + options.blockchain)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        /**
         * Set the default interchain network for the chain to use (L5 Only)
         */
        this.setDefaultInterchainNetwork = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var body;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.blockchain)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `blockchain` is required');
                        if (!options.name)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `name` is required');
                        body = {
                            version: '1',
                            blockchain: options.blockchain,
                            name: options.name
                        };
                        return [4 /*yield*/, this.post("/v1/interchains/default", body)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        /**
         * Get the set default interchain network for this chain (L5 Only)
         */
        this.getDefaultInterchainNetwork = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get('/v1/interchains/default')];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        /**
         * !This method is deprecated and should not be used!
         * Backwards compatibility will exist for legacy chains, but will not work on new chains. listInterchainNetworks should be used instead
         *
         * Gets a list of the chain's interchain addresses
         */
        this.getPublicBlockchainAddresses = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        index_1.logger.warn('This method is deprecated. It will continue to work for legacy chains, but will not work on any new chains. Use listInterchainNetworks instead');
                        return [4 /*yield*/, this.get('/v1/public-blockchain-address')];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        /**
         * !This method is deprecated and should not be used!
         * Backwards compatibility will exist for legacy chains, but will not work on new chains. signBitcoinTransaction should be used instead
         *
         * Sign a transaction for a bitcoin network
         */
        this.createBitcoinTransaction = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var body;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        index_1.logger.warn('This method is deprecated. It will continue to work for legacy chains, but will not work on any new chains. Use signBitcoinTransaction instead');
                        if (!options.network)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `network` is required');
                        if (options.satoshisPerByte && !Number.isInteger(options.satoshisPerByte))
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `satoshisPerByte` must be an integer');
                        body = {
                            network: options.network,
                            transaction: {}
                        };
                        if (options.satoshisPerByte)
                            body.transaction.fee = options.satoshisPerByte;
                        if (options.data)
                            body.transaction.data = options.data;
                        if (options.changeAddress)
                            body.transaction.change = options.changeAddress;
                        if (options.outputs) {
                            body.transaction.outputs = [];
                            options.outputs.forEach(function (output) {
                                body.transaction.outputs.push({
                                    to: output.to,
                                    value: output.value
                                });
                            });
                        }
                        return [4 /*yield*/, this.post('/v1/public-blockchain-transaction', body)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        /**
         * !This method is deprecated and should not be used!
         * Backwards compatibility will exist for legacy chains, but will not work on new chains. signEthereumTransaction should be used instead
         *
         * Sign a transaction for an ethereum network
         */
        this.createEthereumTransaction = function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var body;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        index_1.logger.warn('This method is deprecated. It will continue to work for legacy chains, but will not work on any new chains. Use signEthereumTransaction instead');
                        if (!options.network)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `network` is required');
                        if (!options.to)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `to` is required');
                        if (!options.value)
                            throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `value` is required');
                        body = {
                            network: options.network,
                            transaction: {
                                to: options.to,
                                value: options.value
                            }
                        };
                        if (options.data)
                            body.transaction.data = options.data;
                        if (options.gasPrice)
                            body.transaction.gasPrice = options.gasPrice;
                        if (options.gas)
                            body.transaction.gas = options.gas;
                        return [4 /*yield*/, this.post('/v1/public-blockchain-transaction', body)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        /**
         * @hidden
         */
        this.validateAndBuildCustomIndexFieldsArray = function (customIndexFields) {
            var returnList = [];
            customIndexFields.forEach(function (customIndexField) {
                var customTransactionFieldBody = {
                    path: customIndexField.path,
                    field_name: customIndexField.fieldName,
                    type: customIndexField.type
                };
                if (customIndexField.options) {
                    var optionsBody = {};
                    if (customIndexField.options.noIndex !== undefined)
                        optionsBody.no_index = customIndexField.options.noIndex;
                    if (customIndexField.type === 'tag') {
                        if (customIndexField.options.separator !== undefined)
                            optionsBody.separator = customIndexField.options.separator;
                    }
                    else if (customIndexField.type === 'text') {
                        if (customIndexField.options.noStem !== undefined)
                            optionsBody.no_stem = customIndexField.options.noStem;
                        if (customIndexField.options.weight !== undefined)
                            optionsBody.weight = customIndexField.options.weight;
                        if (customIndexField.options.sortable !== undefined)
                            optionsBody.sortable = customIndexField.options.sortable;
                    }
                    else if (customIndexField.type === 'number') {
                        if (customIndexField.options.sortable !== undefined)
                            optionsBody.sortable = customIndexField.options.sortable;
                    }
                    else {
                        throw new FailureByDesign_1.FailureByDesign('PARAM_ERROR', 'Parameter `customIndexFields[].type must be `tag`, `text`, or `number`');
                    }
                    customTransactionFieldBody.options = optionsBody;
                }
                returnList.push(customTransactionFieldBody);
            });
            return returnList;
        };
        /**
         * @hidden
         */
        this.generateQueryString = function (queryObject) { return (Object.keys(queryObject).length > 0 ? "?" + UrlSearchParams(queryObject) : ''); };
        /**
         * @hidden
         * For development purposes only! NodeJS naturally distrusts self signed certs (for good reason!). This function allows users the option to "not care" about self signed certs.
         * @param {function} asyncFunction an async function to call while NODE_TLS_REJECT_UNAUTHORIZED is quickly toggled from "1" to "0" and back to "1"
         */
        this.toggleSslCertVerification = function (asyncFunction) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        process.env.NODE_TLS_REJECT_UNAUTHORIZED = this.verify ? '1' : '0';
                        return [4 /*yield*/, asyncFunction()];
                    case 1:
                        result = _a.sent();
                        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';
                        return [2 /*return*/, result];
                }
            });
        }); };
        this.endpoint = endpoint;
        this.verify = verify;
        this.credentialService = credentials;
        this.fetch = injected.fetch || node_fetch_1.default;
        this.readFileAsync = injected.readFileAsync || readFileAsync;
    }
    /**
     * @hidden
     */
    DragonchainClient.prototype.getTimestamp = function () {
        return "" + new Date().toISOString().slice(0, -1) + (Math.floor(Math.random() * 900) + 100) + "Z";
    };
    /**
     * @hidden
     */
    DragonchainClient.prototype.get = function (path, jsonParse) {
        if (jsonParse === void 0) { jsonParse = true; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(path, 'GET', undefined, undefined, jsonParse)];
            });
        });
    };
    /**
     * @hidden
     */
    DragonchainClient.prototype.post = function (path, body, callbackURL) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var bodyString;
            return tslib_1.__generator(this, function (_a) {
                bodyString = typeof body === 'string' ? body : JSON.stringify(body);
                return [2 /*return*/, this.makeRequest(path, 'POST', callbackURL, bodyString)];
            });
        });
    };
    /**
     * @hidden
     */
    DragonchainClient.prototype.put = function (path, body) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var bodyString;
            return tslib_1.__generator(this, function (_a) {
                bodyString = typeof body === 'string' ? body : JSON.stringify(body);
                return [2 /*return*/, this.makeRequest(path, 'PUT', undefined, bodyString)];
            });
        });
    };
    /**
     * @hidden
     */
    DragonchainClient.prototype.patch = function (path, body) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var bodyString;
            return tslib_1.__generator(this, function (_a) {
                bodyString = typeof body === 'string' ? body : JSON.stringify(body);
                return [2 /*return*/, this.makeRequest(path, 'PATCH', undefined, bodyString)];
            });
        });
    };
    /**
     * @hidden
     */
    DragonchainClient.prototype.delete = function (path) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(path, 'DELETE')];
            });
        });
    };
    /**
     * @hidden
     */
    DragonchainClient.prototype.getFetchOptions = function (path, method, callbackURL, body, contentType) {
        if (callbackURL === void 0) { callbackURL = ''; }
        if (body === void 0) { body = ''; }
        if (contentType === void 0) { contentType = ''; }
        var timestamp = this.getTimestamp();
        var options = {
            method: method,
            body: body || undefined,
            credentials: 'omit',
            headers: {
                dragonchain: this.credentialService.dragonchainId,
                Authorization: this.credentialService.getAuthorizationHeader(method, path, timestamp, contentType, body || ''),
                timestamp: timestamp
            }
        };
        if (contentType)
            options.headers['Content-Type'] = contentType;
        if (callbackURL)
            options.headers['X-Callback-URL'] = callbackURL;
        return options;
    };
    /**
     * @hidden
     */
    DragonchainClient.prototype.makeRequest = function (path, method, callbackURL, body, jsonParse) {
        if (callbackURL === void 0) { callbackURL = ''; }
        if (body === void 0) { body = ''; }
        if (jsonParse === void 0) { jsonParse = true; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var contentType, fetchData, url, res, status, ok, statusText, response;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        contentType = '';
                        // assume content type is json if a body is provided, as it's the only content-type supported
                        if (body)
                            contentType = 'application/json';
                        fetchData = this.getFetchOptions(path, method, callbackURL, body, contentType);
                        url = "" + this.endpoint + path;
                        index_1.logger.debug("[DragonchainClient][FETCH][URL] ==> " + url);
                        index_1.logger.debug("[DragonchainClient][FETCH][DATA] ==> " + JSON.stringify(fetchData));
                        return [4 /*yield*/, this.toggleSslCertVerification(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                                return [2 /*return*/, this.fetch(url, fetchData)];
                            }); }); })];
                    case 1:
                        res = _a.sent();
                        status = res.status, ok = res.ok, statusText = res.statusText;
                        index_1.logger.debug("[DragonchainClient][" + method + "] <== " + url + " " + status + " " + statusText);
                        return [4 /*yield*/, (jsonParse ? res.json() : res.text())];
                    case 2:
                        response = _a.sent();
                        index_1.logger.debug("[DragonchainClient][" + method + "] <== " + JSON.stringify(response));
                        return [2 /*return*/, { status: status, response: response, ok: ok }];
                }
            });
        });
    };
    return DragonchainClient;
}());
exports.DragonchainClient = DragonchainClient;
/**
 * Create and return an instantiation of a dragonchain client
 */
exports.createClient = function (options) {
    if (options === void 0) { options = {}; }
    return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, credentials;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!!options.dragonchainId) return [3 /*break*/, 2];
                    _a = options;
                    return [4 /*yield*/, config_service_1.getDragonchainId()];
                case 1:
                    _a.dragonchainId = _c.sent();
                    _c.label = 2;
                case 2:
                    if (!!options.endpoint) return [3 /*break*/, 4];
                    _b = options;
                    return [4 /*yield*/, config_service_1.getDragonchainEndpoint(options.dragonchainId)];
                case 3:
                    _b.endpoint = _c.sent();
                    _c.label = 4;
                case 4:
                    // Set defaults
                    if (!options.algorithm)
                        options.algorithm = 'SHA256';
                    if (options.verify !== false)
                        options.verify = true;
                    return [4 /*yield*/, CredentialService_1.CredentialService.createCredentials(options.dragonchainId, options.authKey || '', options.authKeyId || '', options.algorithm)];
                case 5:
                    credentials = _c.sent();
                    return [2 /*return*/, new DragonchainClient(options.endpoint, credentials, options.verify)];
            }
        });
    });
};

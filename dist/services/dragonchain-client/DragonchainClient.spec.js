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
var chai = require("chai");
var sinonChai = require("sinon-chai");
var sinon_1 = require("sinon");
var DragonchainClient_1 = require("./DragonchainClient");
var CredentialService_1 = require("../credential-service/CredentialService");
var expect = chai.expect;
chai.use(sinonChai);
var fakeTime = "" + new Date().toISOString().slice(0, -1) + (Math.floor(Math.random() * 900) + 100) + "Z";
var fakeTimeStamp = Date.now();
sinon_1.useFakeTimers({ now: fakeTimeStamp, shouldAdvanceTime: false });
sinon_1.stub(DragonchainClient_1.DragonchainClient.prototype, 'getTimestamp').returns(fakeTime);
describe('DragonchainClient', function () {
    describe('#constructor', function () {
        it('returns instance of DragonchainClient', function () {
            var client = new DragonchainClient_1.DragonchainClient('banana', new CredentialService_1.CredentialService('id', { authKey: 'key', authKeyId: 'keyId' }, 'SHA256'), true);
            expect(client instanceof DragonchainClient_1.DragonchainClient).to.equal(true);
        });
    });
    describe('GET', function () {
        var fakeResponseObj;
        var fetch;
        var readFileAsync;
        var CredentialService;
        var logger;
        var client;
        var expectedFetchOptions;
        var fakeResponseText;
        var fakeSecretText;
        beforeEach(function () {
            fakeResponseObj = { body: 'fakeResponseBody' };
            fakeResponseText = 'fakeString';
            fakeSecretText = 'fakeSecret';
            fetch = sinon_1.stub().resolves({ status: 200, json: sinon_1.stub().resolves(fakeResponseObj), text: sinon_1.stub().resolves(fakeResponseText) });
            readFileAsync = sinon_1.stub().returns(fakeSecretText);
            CredentialService = { getAuthorizationHeader: sinon_1.stub().returns('fakeCreds'), dragonchainId: 'fakeDragonchainId' };
            logger = { log: sinon_1.stub(), debug: sinon_1.stub() };
            var injected = { logger: logger, fetch: fetch, readFileAsync: readFileAsync };
            client = new DragonchainClient_1.DragonchainClient('fakeUrl', CredentialService, true, injected);
            expectedFetchOptions = {
                method: 'GET',
                body: undefined,
                credentials: 'omit',
                headers: {
                    dragonchain: 'fakeDragonchainId',
                    Authorization: 'fakeCreds',
                    timestamp: fakeTime
                }
            };
        });
        describe('.getSmartContractSecret', function () {
            it('calls readFileAsync with correct dragonchain id and secret name', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            process.env.SMART_CONTRACT_ID = 'fakeSmartContractId';
                            return [4 /*yield*/, client.getSmartContractSecret({ secretName: 'fakeSecretName' })];
                        case 1:
                            _a.sent();
                            sinon_1.assert.calledWith(readFileAsync, '/var/openfaas/secrets/sc-fakeSmartContractId-fakeSecretName', 'utf-8');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('.getStatus', function () {
            it('calls #fetch() with correct params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client.getStatus()];
                        case 1:
                            _a.sent();
                            sinon_1.assert.calledWith(fetch, 'fakeUrl/v1/status', expectedFetchOptions);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('.getApiKey', function () {
            it('calls #fetch() with correct params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client.getApiKey({ keyId: 'MyKeyID' })];
                        case 1:
                            _a.sent();
                            sinon_1.assert.calledWith(fetch, 'fakeUrl/v1/api-key/MyKeyID', expectedFetchOptions);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('.listApiKeys', function () {
            it('calls #fetch() with correct params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client.listApiKeys()];
                        case 1:
                            _a.sent();
                            sinon_1.assert.calledWith(fetch, 'fakeUrl/v1/api-key', expectedFetchOptions);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('.getTransaction', function () {
            it('calls #fetch() with correct params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var id;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            id = 'batman-transaction-id';
                            return [4 /*yield*/, client.getTransaction({ transactionId: id })];
                        case 1:
                            _a.sent();
                            sinon_1.assert.calledWith(fetch, "fakeUrl/v1/transaction/" + id, expectedFetchOptions);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('.getBlock', function () {
            it('calls #fetch() with correct params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var id;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            id = 'robin-block-id';
                            return [4 /*yield*/, client.getBlock({ blockId: id })];
                        case 1:
                            _a.sent();
                            sinon_1.assert.calledWith(fetch, "fakeUrl/v1/block/" + id, expectedFetchOptions);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('.getSmartContract', function () {
            it('calls #fetch() with correct params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var id;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            id = 'joker-smartcontract-id';
                            return [4 /*yield*/, client.getSmartContract({ smartContractId: id })];
                        case 1:
                            _a.sent();
                            sinon_1.assert.calledWith(fetch, "fakeUrl/v1/contract/" + id, expectedFetchOptions);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('.getPublicBlockchainAddresses', function () {
            it('calls #fetch() with correct params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client.getPublicBlockchainAddresses()];
                        case 1:
                            _a.sent();
                            sinon_1.assert.calledWith(fetch, 'fakeUrl/v1/public-blockchain-address', expectedFetchOptions);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('.getPendingVerifications', function () {
            it('calls #fetch() with correct params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var id;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            id = 'block_id';
                            return [4 /*yield*/, client.getPendingVerifications({ blockId: id })];
                        case 1:
                            _a.sent();
                            sinon_1.assert.calledWith(fetch, "fakeUrl/v1/verifications/pending/" + id, expectedFetchOptions);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('.getSmartContractObject', function () {
            it('calls #fetch() with correct params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var key;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            key = 'myKey';
                            return [4 /*yield*/, client.getSmartContractObject({ key: key })];
                        case 1:
                            _a.sent();
                            sinon_1.assert.calledWith(fetch, "fakeUrl/v1/get/fakeSmartContractId/" + key, expectedFetchOptions);
                            return [2 /*return*/];
                    }
                });
            }); });
            describe('.getSmartContractObject', function () {
                before(function () {
                    process.env.DRAGONCHAIN_ENV = 'test';
                });
                after(function () {
                    process.env.DRAGONCHAIN_ENV = undefined;
                });
                it('calls #fetch() with correct params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var key, x;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                key = 'myKey';
                                return [4 /*yield*/, client.getSmartContractObject({ key: key })];
                            case 1:
                                x = _a.sent();
                                expect(x).to.deep.equal({ status: 404, response: 'null', ok: false });
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
        describe('.getVerifications', function () {
            it('calls #fetch() with correct params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var id;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            id = 'block_id';
                            return [4 /*yield*/, client.getVerifications({ blockId: id })];
                        case 1:
                            _a.sent();
                            sinon_1.assert.calledWith(fetch, "fakeUrl/v1/verifications/" + id, expectedFetchOptions);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('.queryTransactions', function () {
            it('calls #fetch() with correct params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client.queryTransactions({
                                transactionType: 'testing',
                                redisearchQuery: 'banana',
                                verbatim: false,
                                limit: 2,
                                offset: 1,
                                idsOnly: false,
                                sortAscending: false,
                                sortBy: 'whatever'
                            })];
                        case 1:
                            _a.sent();
                            sinon_1.assert.calledWith(fetch, 'fakeUrl/v1/transaction?transaction_type=testing&q=banana&offset=1&limit=2&verbatim=false&id_only=false&sort_by=whatever&sort_asc=false', expectedFetchOptions);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('defaults offset and limit', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client.queryTransactions({
                                transactionType: 'test',
                                redisearchQuery: 'yeah'
                            })];
                        case 1:
                            _a.sent();
                            sinon_1.assert.calledWith(fetch, 'fakeUrl/v1/transaction?transaction_type=test&q=yeah&offset=0&limit=10', expectedFetchOptions);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('.queryBlocks', function () {
            it('calls #fetch() with correct params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client.queryBlocks({ redisearchQuery: 'banana', limit: 2, offset: 1, idsOnly: false, sortAscending: false, sortBy: 'something' })];
                        case 1:
                            _a.sent();
                            sinon_1.assert.calledWith(fetch, "fakeUrl/v1/block?q=banana&offset=1&limit=2&id_only=false&sort_by=something&sort_asc=false", expectedFetchOptions);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('defaults offset and limit', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client.queryBlocks({
                                redisearchQuery: 'yeah'
                            })];
                        case 1:
                            _a.sent();
                            sinon_1.assert.calledWith(fetch, 'fakeUrl/v1/block?q=yeah&offset=0&limit=10', expectedFetchOptions);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('.listSmartContracts', function () {
            it('calls #fetch() with correct params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client.listSmartContracts()];
                        case 1:
                            _a.sent();
                            sinon_1.assert.calledWith(fetch, "fakeUrl/v1/contract", expectedFetchOptions);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('.getSmartContractLogs', function () {
            it('calls #fetch() with correct params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client.getSmartContractLogs({ smartContractId: 'test', tail: 100, since: 'a-date' })];
                        case 1:
                            _a.sent();
                            sinon_1.assert.calledWith(fetch, "fakeUrl/v1/contract/test/logs?tail=100&since=a-date", expectedFetchOptions);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('calls #fetch() with correct params and missing erroneous ?', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client.getSmartContractLogs({ smartContractId: 'test' })];
                        case 1:
                            _a.sent();
                            sinon_1.assert.calledWith(fetch, "fakeUrl/v1/contract/test/logs", expectedFetchOptions);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('.getInterchainNetwork', function () {
            it('calls #fetch() with correct params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client.getInterchainNetwork({ blockchain: 'bitcoin', name: 'banana' })];
                        case 1:
                            _a.sent();
                            sinon_1.assert.calledWith(fetch, 'fakeUrl/v1/interchains/bitcoin/banana');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('.listInterchainNetworks', function () {
            it('calls #fetch() with correct params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client.listInterchainNetworks({ blockchain: 'bitcoin' })];
                        case 1:
                            _a.sent();
                            sinon_1.assert.calledWith(fetch, 'fakeUrl/v1/interchains/bitcoin');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('.getDefaultInterchainNetwork', function () {
            it('calls #fetch() with correct params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client.getDefaultInterchainNetwork()];
                        case 1:
                            _a.sent();
                            sinon_1.assert.calledWith(fetch, 'fakeUrl/v1/interchains/default');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('DELETE', function () {
        var fakeResponseObj = { body: 'fakeResponseBody' };
        var fakeResponseText = 'fakeString';
        var fetch = sinon_1.stub().resolves({ status: 200, json: sinon_1.stub().resolves(fakeResponseObj), text: sinon_1.stub().resolves(fakeResponseText) });
        var CredentialService = { getAuthorizationHeader: sinon_1.stub().returns('fakeCreds'), dragonchainId: 'fakeDragonchainId' };
        var logger = { log: sinon_1.stub(), debug: sinon_1.stub() };
        var injected = { logger: logger, fetch: fetch };
        var client = new DragonchainClient_1.DragonchainClient('fakeUrl', CredentialService, true, injected);
        var expectedFetchOptions = {
            method: 'DELETE',
            credentials: 'omit',
            headers: {
                dragonchain: 'fakeDragonchainId',
                Authorization: 'fakeCreds',
                timestamp: fakeTime
            },
            body: undefined
        };
        describe('.deleteSmartContract', function () {
            it('calls #fetch() with correct params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var param;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            param = 'banana';
                            return [4 /*yield*/, client.deleteSmartContract({ smartContractId: param })];
                        case 1:
                            _a.sent();
                            sinon_1.assert.calledWith(fetch, 'fakeUrl/v1/contract/banana', expectedFetchOptions);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('.deleteApiKey', function () {
            it('calls #fetch() with correct params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client.deleteApiKey({ keyId: 'MyKeyID' })];
                        case 1:
                            _a.sent();
                            sinon_1.assert.calledWith(fetch, 'fakeUrl/v1/api-key/MyKeyID', expectedFetchOptions);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('.deleteInterchainNetwork', function () {
            it('calls #fetch() with correct params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client.deleteInterchainNetwork({ blockchain: 'bitcoin', name: 'banana' })];
                        case 1:
                            _a.sent();
                            sinon_1.assert.calledWith(fetch, 'fakeUrl/v1/interchains/bitcoin/banana');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('POST', function () {
        var fakeResponseObj = { body: 'fakeResponseBody' };
        var fakeResponseText = 'fakeString';
        var fetch = sinon_1.stub().resolves({ status: 200, json: sinon_1.stub().resolves(fakeResponseObj), text: sinon_1.stub().resolves(fakeResponseText) });
        var CredentialService = { getAuthorizationHeader: sinon_1.stub().returns('fakeCreds'), dragonchainId: 'fakeDragonchainId' };
        var logger = { log: sinon_1.stub(), debug: sinon_1.stub() };
        var injected = { logger: logger, CredentialService: CredentialService, fetch: fetch };
        var client = new DragonchainClient_1.DragonchainClient('fakeUrl', CredentialService, true, injected);
        var expectedFetchOptions = {
            method: 'POST',
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/json',
                dragonchain: 'fakeDragonchainId',
                Authorization: 'fakeCreds',
                timestamp: fakeTime
            }
        };
        describe('.createApiKey', function () {
            it('calls #fetch() with correct params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var expectedBody;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client.createApiKey()];
                        case 1:
                            _a.sent();
                            expectedBody = {};
                            sinon_1.assert.calledWith(fetch, 'fakeUrl/v1/api-key', tslib_1.__assign({}, expectedFetchOptions, { body: JSON.stringify(expectedBody) }));
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('.createTransaction', function () {
            it('calls #fetch() with correct params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var transactionCreatePayload, expectedBody, obj;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            transactionCreatePayload = {
                                transactionType: 'transaction',
                                payload: 'hi!',
                                tag: 'Awesome!'
                            };
                            expectedBody = {
                                version: '1',
                                txn_type: transactionCreatePayload.transactionType,
                                payload: transactionCreatePayload.payload,
                                tag: transactionCreatePayload.tag
                            };
                            return [4 /*yield*/, client.createTransaction(transactionCreatePayload)];
                        case 1:
                            _a.sent();
                            obj = tslib_1.__assign({}, expectedFetchOptions, { body: JSON.stringify(expectedBody) });
                            sinon_1.assert.calledWith(fetch, 'fakeUrl/v1/transaction', obj);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('.createTransactionType', function () {
            it('calls #fetch() with correct params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var expectedBody, obj;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            expectedBody = {
                                version: '2',
                                txn_type: 'testing',
                                custom_indexes: [
                                    {
                                        path: 'testPath',
                                        field_name: 'someField',
                                        type: 'text',
                                        options: {
                                            no_index: false,
                                            weight: 0.5,
                                            sortable: true
                                        }
                                    }
                                ]
                            };
                            return [4 /*yield*/, client.createTransactionType({
                                    transactionType: 'testing',
                                    customIndexFields: [{ path: 'testPath', fieldName: 'someField', type: 'text', options: { noIndex: false, sortable: true, weight: 0.5 } }]
                                })];
                        case 1:
                            _a.sent();
                            obj = tslib_1.__assign({}, expectedFetchOptions, { body: JSON.stringify(expectedBody) });
                            sinon_1.assert.calledWith(fetch, 'fakeUrl/v1/transaction-type', obj);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('.createSmartContract', function () {
            it('create custom contract successfully', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var contractPayload, expectedBody, obj;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            contractPayload = {
                                transactionType: 'name',
                                image: 'ubuntu:latest',
                                environmentVariables: { banana: 'banana', apple: 'banana' },
                                cmd: 'banana',
                                args: ['-m', 'cool']
                            };
                            expectedBody = {
                                version: '3',
                                txn_type: 'name',
                                image: contractPayload.image,
                                execution_order: 'parallel',
                                cmd: contractPayload.cmd,
                                args: contractPayload.args,
                                env: contractPayload.environmentVariables
                            };
                            return [4 /*yield*/, client.createSmartContract(contractPayload)];
                        case 1:
                            _a.sent();
                            obj = tslib_1.__assign({}, expectedFetchOptions, { body: JSON.stringify(expectedBody) });
                            sinon_1.assert.calledWith(fetch, 'fakeUrl/v1/contract', obj);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('.createEthereumTransaction', function () {
            it('calls #fetch() with correct params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var transactionCreatePayload, expectedBody, obj;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            transactionCreatePayload = {
                                network: 'ETH_MAINNET',
                                to: '0x0000000000000000000000000000000000000000',
                                value: '0x0',
                                data: '0x111',
                                gasPrice: '0x222',
                                gas: '0x333'
                            };
                            expectedBody = {
                                network: transactionCreatePayload.network,
                                transaction: {
                                    to: transactionCreatePayload.to,
                                    value: transactionCreatePayload.value,
                                    data: transactionCreatePayload.data,
                                    gasPrice: transactionCreatePayload.gasPrice,
                                    gas: transactionCreatePayload.gas
                                }
                            };
                            return [4 /*yield*/, client.createEthereumTransaction(transactionCreatePayload)];
                        case 1:
                            _a.sent();
                            obj = tslib_1.__assign({}, expectedFetchOptions, { body: JSON.stringify(expectedBody) });
                            sinon_1.assert.calledWith(fetch, 'fakeUrl/v1/public-blockchain-transaction', obj);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('.createBitcoinInterchain', function () {
            it('calls #fetch() with correct params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var fakeBody, obj;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fakeBody = {
                                version: '1',
                                name: 'banana',
                                testnet: true,
                                private_key: 'abcd',
                                rpc_address: 'some rpc',
                                rpc_authorization: 'some auth',
                                utxo_scan: false
                            };
                            return [4 /*yield*/, client.createBitcoinInterchain({ name: 'banana', testnet: true, privateKey: 'abcd', rpcAddress: 'some rpc', rpcAuthorization: 'some auth', utxoScan: false })];
                        case 1:
                            _a.sent();
                            obj = tslib_1.__assign({}, expectedFetchOptions, { body: JSON.stringify(fakeBody) });
                            sinon_1.assert.calledWith(fetch, 'fakeUrl/v1/interchains/bitcoin', obj);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('.createEthereumInterchain', function () {
            it('calls #fetch() with correct params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var fakeBody, obj;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fakeBody = {
                                version: '1',
                                name: 'banana',
                                private_key: 'private key',
                                rpc_address: 'some rpc',
                                chain_id: 12
                            };
                            return [4 /*yield*/, client.createEthereumInterchain({ name: 'banana', privateKey: 'private key', rpcAddress: 'some rpc', chainId: 12 })];
                        case 1:
                            _a.sent();
                            obj = tslib_1.__assign({}, expectedFetchOptions, { body: JSON.stringify(fakeBody) });
                            sinon_1.assert.calledWith(fetch, 'fakeUrl/v1/interchains/ethereum', obj);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('.signBitcoinTransaction', function () {
            it('calls #fetch() with correct params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var fakeBody, obj;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fakeBody = {
                                version: '1',
                                fee: 4,
                                data: 'someData',
                                change: 'change address',
                                outputs: [{ to: 'toaddr', value: 1.234 }]
                            };
                            return [4 /*yield*/, client.signBitcoinTransaction({ name: 'banana', satoshisPerByte: 4, data: 'someData', changeAddress: 'change address', outputs: [{ to: 'toaddr', value: 1.234 }] })];
                        case 1:
                            _a.sent();
                            obj = tslib_1.__assign({}, expectedFetchOptions, { body: JSON.stringify(fakeBody) });
                            sinon_1.assert.calledWith(fetch, 'fakeUrl/v1/interchains/bitcoin/banana/transaction', obj);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('.signEthereumTransaction', function () {
            it('calls #fetch() with correct params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var fakeBody, obj;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fakeBody = {
                                version: '1',
                                to: 'some addr',
                                value: 'some value',
                                data: 'someData',
                                gasPrice: 'gas price',
                                gas: 'gas',
                                nonce: 'nonce'
                            };
                            return [4 /*yield*/, client.signEthereumTransaction({ name: 'banana', to: 'some addr', value: 'some value', data: 'someData', gasPrice: 'gas price', gas: 'gas', nonce: 'nonce' })];
                        case 1:
                            _a.sent();
                            obj = tslib_1.__assign({}, expectedFetchOptions, { body: JSON.stringify(fakeBody) });
                            sinon_1.assert.calledWith(fetch, 'fakeUrl/v1/interchains/ethereum/banana/transaction', obj);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('.setDefaultInterchainNetwork', function () {
            it('calls #fetch() with correct params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var fakeBody, obj;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fakeBody = {
                                version: '1',
                                blockchain: 'bitcoin',
                                name: 'banana'
                            };
                            return [4 /*yield*/, client.setDefaultInterchainNetwork({ name: 'banana', blockchain: 'bitcoin' })];
                        case 1:
                            _a.sent();
                            obj = tslib_1.__assign({}, expectedFetchOptions, { body: JSON.stringify(fakeBody) });
                            sinon_1.assert.calledWith(fetch, 'fakeUrl/v1/interchains/default', obj);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('PUT', function () {
        var fakeResponseObj = { body: 'fakeResponseBody' };
        var fakeResponseText = 'fakeString';
        var fetch = sinon_1.stub().resolves({ status: 200, json: sinon_1.stub().resolves(fakeResponseObj), text: sinon_1.stub().resolves(fakeResponseText) });
        var CredentialService = { getAuthorizationHeader: sinon_1.stub().returns('fakeCreds'), dragonchainId: 'fakeDragonchainId' };
        var logger = { log: sinon_1.stub(), debug: sinon_1.stub() };
        var injected = { logger: logger, CredentialService: CredentialService, fetch: fetch };
        var client = new DragonchainClient_1.DragonchainClient('fakeUrl', CredentialService, true, injected);
        var expectedFetchOptions = {
            method: 'PUT',
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/json',
                dragonchain: 'fakeDragonchainId',
                Authorization: 'fakeCreds',
                timestamp: fakeTime
            }
        };
        describe('.updateSmartContract', function () {
            it('calls #fetch() with correct params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var smartContractId, status, fakeBodyResponse, obj;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            smartContractId = '616152367378';
                            status = 'active';
                            fakeBodyResponse = {
                                version: '3',
                                desired_state: status
                            };
                            return [4 /*yield*/, client.updateSmartContract({ smartContractId: smartContractId, enabled: true })];
                        case 1:
                            _a.sent();
                            obj = tslib_1.__assign({}, expectedFetchOptions, { body: JSON.stringify(fakeBodyResponse) });
                            sinon_1.assert.calledWith(fetch, "fakeUrl/v1/contract/" + smartContractId, obj);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('PATCH', function () {
        var fakeResponseObj = { body: 'fakeResponseBody' };
        var fakeResponseText = 'fakeString';
        var fetch = sinon_1.stub().resolves({ status: 200, json: sinon_1.stub().resolves(fakeResponseObj), text: sinon_1.stub().resolves(fakeResponseText) });
        var CredentialService = { getAuthorizationHeader: sinon_1.stub().returns('fakeCreds'), dragonchainId: 'fakeDragonchainId' };
        var logger = { log: sinon_1.stub(), debug: sinon_1.stub() };
        var injected = { logger: logger, CredentialService: CredentialService, fetch: fetch };
        var client = new DragonchainClient_1.DragonchainClient('fakeUrl', CredentialService, true, injected);
        var expectedFetchOptions = {
            method: 'PATCH',
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/json',
                dragonchain: 'fakeDragonchainId',
                Authorization: 'fakeCreds',
                timestamp: fakeTime
            }
        };
        describe('.updateBitcoinInterchain', function () {
            it('calls #fetch() with correct params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var fakeBody, obj;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fakeBody = {
                                version: '1',
                                testnet: true,
                                private_key: 'abcd',
                                rpc_address: 'some rpc',
                                rpc_authorization: 'some auth',
                                utxo_scan: false
                            };
                            return [4 /*yield*/, client.updateBitcoinInterchain({ name: 'banana', testnet: true, privateKey: 'abcd', rpcAddress: 'some rpc', rpcAuthorization: 'some auth', utxoScan: false })];
                        case 1:
                            _a.sent();
                            obj = tslib_1.__assign({}, expectedFetchOptions, { body: JSON.stringify(fakeBody) });
                            sinon_1.assert.calledWith(fetch, 'fakeUrl/v1/interchains/bitcoin/banana', obj);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('.updateEthereumInterchain', function () {
            it('calls #fetch() with correct params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var fakeBody, obj;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fakeBody = {
                                version: '1',
                                private_key: 'private key',
                                rpc_address: 'some rpc',
                                chain_id: 12
                            };
                            return [4 /*yield*/, client.updateEthereumInterchain({ name: 'banana', privateKey: 'private key', rpcAddress: 'some rpc', chainId: 12 })];
                        case 1:
                            _a.sent();
                            obj = tslib_1.__assign({}, expectedFetchOptions, { body: JSON.stringify(fakeBody) });
                            sinon_1.assert.calledWith(fetch, 'fakeUrl/v1/interchains/ethereum/banana', obj);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});

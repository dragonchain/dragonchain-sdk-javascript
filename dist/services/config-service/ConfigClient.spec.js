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
var chai_1 = require("chai");
var ConfigClient = require("./ConfigCient");
describe('ConfigClient', function () {
    describe('#getConfigFilePath', function () {
        it('returns correct path on windows', function () {
            var platform = function () { return 'win32'; };
            process.env.LOCALAPPDATA = 'test';
            chai_1.expect(ConfigClient.getConfigFilePath({ platform: platform })).to.equal('test/dragonchain/credentials');
        });
        it('returns correct path on non-windows', function () {
            var platform = function () { return 'something_else'; };
            var homedir = function () { return '/home'; };
            chai_1.expect(ConfigClient.getConfigFilePath({ platform: platform, homedir: homedir })).to.equal('/home/.dragonchain/credentials');
        });
    });
    describe('#getIdFromEnvVars', function () {
        it('returns the DRAGONCHAIN_ID env var if present', function () {
            process.env.DRAGONCHAIN_ID = 'test';
            chai_1.expect(ConfigClient.getIdFromEnvVars()).to.equal('test');
        });
        it('returns an empty string if the DRAGONCHAIN_ID env var is not present', function () {
            delete process.env.DRAGONCHAIN_ID;
            chai_1.expect(ConfigClient.getIdFromEnvVars()).to.equal('');
        });
    });
    describe('#getEndpointFromEnvVars', function () {
        it('returns the DRAGONCHAIN_ENDPOINT env var if present', function () {
            process.env.DRAGONCHAIN_ENDPOINT = 'test';
            chai_1.expect(ConfigClient.getEndpointFromEnvVars()).to.equal('test');
        });
        it('returns an empty string if the DRAGONCHAIN_ENDPOINT env var is not present', function () {
            delete process.env.DRAGONCHAIN_ENDPOINT;
            chai_1.expect(ConfigClient.getEndpointFromEnvVars()).to.equal('');
        });
    });
    describe('#getCredsFromEnvVars', function () {
        it('returns the credentials if AUTH_KEY and AUTH_KEY_ID env vars are present', function () {
            process.env.AUTH_KEY = 'testKey';
            process.env.AUTH_KEY_ID = 'testId';
            chai_1.expect(ConfigClient.getCredsFromEnvVars()).to.deep.equal({ authKey: 'testKey', authKeyId: 'testId' });
        });
        it('returns false if AUTH_KEY and AUTH_KEY_ID env vars are not present', function () {
            delete process.env.AUTH_KEY;
            chai_1.expect(ConfigClient.getCredsFromEnvVars()).to.equal(false);
        });
    });
    describe('#getIdFromFile', function () {
        it('returns dragonchain id from correct section if present', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var fakeFile, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        fakeFile = function () { return '[default]\ndragonchain_id = test'; };
                        _a = chai_1.expect;
                        return [4 /*yield*/, ConfigClient.getIdFromFile({ readFileAsync: fakeFile })];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.equal('test');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an empty string on file open error', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var fakeFile, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        fakeFile = function () {
                            throw new Error();
                        };
                        _a = chai_1.expect;
                        return [4 /*yield*/, ConfigClient.getIdFromFile({ readFileAsync: fakeFile })];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.equal('');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an empty string if the correct ini section does not exist', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var fakeFile, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        fakeFile = function () { return '[notDefault]\nsomething = test'; };
                        _a = chai_1.expect;
                        return [4 /*yield*/, ConfigClient.getIdFromFile({ readFileAsync: fakeFile })];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.equal('');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#getEndpointFromFile', function () {
        it('returns endpoint from correct section if present', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var fakeFile, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        fakeFile = function () { return '[id]\nendpoint = test'; };
                        _a = chai_1.expect;
                        return [4 /*yield*/, ConfigClient.getEndpointFromFile('id', { readFileAsync: fakeFile })];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.equal('test');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an empty string on file open error', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var fakeFile, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        fakeFile = function () {
                            throw new Error();
                        };
                        _a = chai_1.expect;
                        return [4 /*yield*/, ConfigClient.getEndpointFromFile('id', { readFileAsync: fakeFile })];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.equal('');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an empty string if the correct ini section does not exist', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var fakeFile, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        fakeFile = function () { return '[something]\nsomething = test'; };
                        _a = chai_1.expect;
                        return [4 /*yield*/, ConfigClient.getEndpointFromFile('id', { readFileAsync: fakeFile })];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.equal('');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#getCredsFromFile', function () {
        it('returns credentials from correct section if present', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var fakeFile, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        fakeFile = function () { return '[id]\nauth_key = key\nauth_key_id = key_id'; };
                        _a = chai_1.expect;
                        return [4 /*yield*/, ConfigClient.getCredsFromFile('id', { readFileAsync: fakeFile })];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.deep.equal({ authKey: 'key', authKeyId: 'key_id' });
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns false on file open error', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var fakeFile, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        fakeFile = function () {
                            throw new Error();
                        };
                        _a = chai_1.expect;
                        return [4 /*yield*/, ConfigClient.getCredsFromFile('id', { readFileAsync: fakeFile })];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.equal(false);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns false if the correct ini section does not exist', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var fakeFile, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        fakeFile = function () { return '[something]\nsomething = test'; };
                        _a = chai_1.expect;
                        return [4 /*yield*/, ConfigClient.getCredsFromFile('id', { readFileAsync: fakeFile })];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.equal(false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#getEndpointFromRemote', function () {
        it('returns endpoint from remote service', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var fakeFetch, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        fakeFetch = function () {
                            return {
                                json: function () {
                                    return { url: 'test' };
                                }
                            };
                        };
                        _a = chai_1.expect;
                        return [4 /*yield*/, ConfigClient.getEndpointFromRemote('id', { fetch: fakeFetch })];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.equal('test');
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws NOT_FOUND when unexpected response schema from remote', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var fakeFetch, e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeFetch = function () {
                            return {
                                json: function () {
                                    return { notUrl: 'test' };
                                }
                            };
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, ConfigClient.getEndpointFromRemote('id', { fetch: fakeFetch })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        chai_1.expect(e_1.code).to.equal('NOT_FOUND');
                        return [2 /*return*/];
                    case 4:
                        chai_1.expect.fail();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws NOT_FOUND when erroring while fetching from remote', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var fakeFetch, e_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeFetch = function () {
                            throw new Error();
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, ConfigClient.getEndpointFromRemote('id', { fetch: fakeFetch })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        chai_1.expect(e_2.code).to.equal('NOT_FOUND');
                        return [2 /*return*/];
                    case 4:
                        chai_1.expect.fail();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#getCredsAsSmartContract', function () {
        it('returns false when credentials arent found in files', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var fakeFile, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        fakeFile = function () {
                            throw new Error();
                        };
                        _a = chai_1.expect;
                        return [4 /*yield*/, ConfigClient.getCredsAsSmartContract({ readFileAsync: fakeFile })];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.equal(false);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns values from files as credentials', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var fakeFile, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        fakeFile = function () { return 'thing'; };
                        _a = chai_1.expect;
                        return [4 /*yield*/, ConfigClient.getCredsAsSmartContract({ readFileAsync: fakeFile })];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.deep.equal({ authKey: 'thing', authKeyId: 'thing' });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#getDragonchainId', function () {
        it('returns ID from env vars', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var getIdFromEnvVars, getIdFromFile, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        getIdFromEnvVars = function () { return 'envId'; };
                        getIdFromFile = function () { return 'fileId'; };
                        _a = chai_1.expect;
                        return [4 /*yield*/, ConfigClient.getDragonchainId({ getIdFromEnvVars: getIdFromEnvVars, getIdFromFile: getIdFromFile })];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.equal('envId');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns ID from config file', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var getIdFromEnvVars, getIdFromFile, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        getIdFromEnvVars = function () { return ''; };
                        getIdFromFile = function () { return 'fileId'; };
                        _a = chai_1.expect;
                        return [4 /*yield*/, ConfigClient.getDragonchainId({ getIdFromEnvVars: getIdFromEnvVars, getIdFromFile: getIdFromFile })];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.equal('fileId');
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws NOT_FOUND when not found', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var getIdFromEnvVars, getIdFromFile, e_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        getIdFromEnvVars = function () { return ''; };
                        getIdFromFile = function () { return ''; };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, ConfigClient.getDragonchainId({ getIdFromEnvVars: getIdFromEnvVars, getIdFromFile: getIdFromFile })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_3 = _a.sent();
                        chai_1.expect(e_3.code).to.equal('NOT_FOUND');
                        return [2 /*return*/];
                    case 4:
                        chai_1.expect.fail();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#getDragonchainEndpoint', function () {
        it('returns Endpoint from env vars', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var getEndpointFromEnvVars, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        getEndpointFromEnvVars = function () { return 'envEndpoint'; };
                        _a = chai_1.expect;
                        return [4 /*yield*/, ConfigClient.getDragonchainEndpoint('id', { getEndpointFromEnvVars: getEndpointFromEnvVars })];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.equal('envEndpoint');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns Endpoint from config file', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var getEndpointFromEnvVars, getEndpointFromFile, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        getEndpointFromEnvVars = function () { return ''; };
                        getEndpointFromFile = function () { return 'fileEndpoint'; };
                        _a = chai_1.expect;
                        return [4 /*yield*/, ConfigClient.getDragonchainEndpoint('id', { getEndpointFromEnvVars: getEndpointFromEnvVars, getEndpointFromFile: getEndpointFromFile })];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.equal('fileEndpoint');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns Endpoint from remote', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var getEndpointFromEnvVars, getEndpointFromFile, getEndpointFromRemote, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        getEndpointFromEnvVars = function () { return ''; };
                        getEndpointFromFile = function () { return ''; };
                        getEndpointFromRemote = function () { return 'remoteEndpoint'; };
                        _a = chai_1.expect;
                        return [4 /*yield*/, ConfigClient.getDragonchainEndpoint('id', { getEndpointFromEnvVars: getEndpointFromEnvVars, getEndpointFromFile: getEndpointFromFile, getEndpointFromRemote: getEndpointFromRemote })];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.equal('remoteEndpoint');
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws Error from getEndpointFromRemote', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var error, getEndpointFromEnvVars, getEndpointFromFile, getEndpointFromRemote, e_4;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        error = new Error('thing');
                        getEndpointFromEnvVars = function () { return ''; };
                        getEndpointFromFile = function () { return ''; };
                        getEndpointFromRemote = function () {
                            throw error;
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, ConfigClient.getDragonchainEndpoint('id', { getEndpointFromEnvVars: getEndpointFromEnvVars, getEndpointFromFile: getEndpointFromFile, getEndpointFromRemote: getEndpointFromRemote })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_4 = _a.sent();
                        chai_1.expect(e_4).to.equal(error);
                        return [2 /*return*/];
                    case 4:
                        chai_1.expect.fail();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#getDragonchainCredentials', function () {
        it('returns credentials from env vars', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var creds, getCredsFromEnvVars, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        creds = { authKey: 'thing', authKeyId: 'keyid' };
                        getCredsFromEnvVars = function () { return creds; };
                        _a = chai_1.expect;
                        return [4 /*yield*/, ConfigClient.getDragonchainCredentials('id', { getCredsFromEnvVars: getCredsFromEnvVars })];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.equal(creds);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns credentials from config file', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var creds, getCredsFromEnvVars, getCredsFromFile, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        creds = { authKey: 'thing', authKeyId: 'keyid' };
                        getCredsFromEnvVars = function () { return false; };
                        getCredsFromFile = function () { return creds; };
                        _a = chai_1.expect;
                        return [4 /*yield*/, ConfigClient.getDragonchainCredentials('id', { getCredsFromEnvVars: getCredsFromEnvVars, getCredsFromFile: getCredsFromFile })];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.equal(creds);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns credentials from smart contract location', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var creds, getCredsFromEnvVars, getCredsFromFile, getCredsAsSmartContract, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        creds = { authKey: 'thing', authKeyId: 'keyid' };
                        getCredsFromEnvVars = function () { return false; };
                        getCredsFromFile = function () { return false; };
                        getCredsAsSmartContract = function () { return creds; };
                        _a = chai_1.expect;
                        return [4 /*yield*/, ConfigClient.getDragonchainCredentials('id', { getCredsFromEnvVars: getCredsFromEnvVars, getCredsFromFile: getCredsFromFile, getCredsAsSmartContract: getCredsAsSmartContract })];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.equal(creds);
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws NOT_FOUND when not found', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var getCredsFromEnvVars, getCredsFromFile, getCredsAsSmartContract, e_5;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        getCredsFromEnvVars = function () { return false; };
                        getCredsFromFile = function () { return false; };
                        getCredsAsSmartContract = function () { return false; };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, ConfigClient.getDragonchainCredentials('id', { getCredsFromEnvVars: getCredsFromEnvVars, getCredsFromFile: getCredsFromFile, getCredsAsSmartContract: getCredsAsSmartContract })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_5 = _a.sent();
                        chai_1.expect(e_5.code).to.equal('NOT_FOUND');
                        return [2 /*return*/];
                    case 4:
                        chai_1.expect.fail();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});

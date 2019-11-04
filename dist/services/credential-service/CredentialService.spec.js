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
var CredentialService_1 = require("./CredentialService");
describe('CredentialService', function () {
    var credentialService;
    beforeEach(function () {
        credentialService = new CredentialService_1.CredentialService('testId', { authKey: 'key', authKeyId: 'keyId' }, 'SHA256');
    });
    describe('.createCredentials', function () {
        it('calls and uses getDragonchainCredentials when credentials are not provided', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var fakeGetCreds, dcid, service;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeGetCreds = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                return [2 /*return*/, { authKey: 'key', authKeyId: 'keyId' }];
                            });
                        }); };
                        dcid = 'dcid';
                        return [4 /*yield*/, CredentialService_1.CredentialService.createCredentials(dcid, '', '', 'SHA256', { getDragonchainCredentials: fakeGetCreds })];
                    case 1:
                        service = _a.sent();
                        chai_1.expect(service.dragonchainId).to.equal(dcid);
                        chai_1.expect(service.credentials.authKey).to.equal('key');
                        chai_1.expect(service.credentials.authKeyId).to.equal('keyId');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#constructor', function () {
        it('initializes with correct variables', function () {
            var dcid = 'dcid';
            var key = 'key';
            var keyId = 'keyId';
            var algo = 'SHA256';
            var service = new CredentialService_1.CredentialService(dcid, { authKey: key, authKeyId: keyId }, algo);
            chai_1.expect(service.dragonchainId).to.equal(dcid);
            chai_1.expect(service.credentials.authKey).to.equal(key);
            chai_1.expect(service.credentials.authKeyId).to.equal(keyId);
            chai_1.expect(service.hmacAlgo).to.equal(algo);
        });
    });
    describe('#getAuthorizationHeader', function () {
        it('returns expected hmac', function () {
            var result = credentialService.getAuthorizationHeader('GET', '/path', 'timestamp', 'application/json', '');
            chai_1.expect(result).to.equal('DC1-HMAC-SHA256 keyId:8Bc+h0parZxGeMB9rYzzRUuNxxHSIjGqSD4W/635A9k=');
            var result2 = credentialService.getAuthorizationHeader('POST', '/new_path', 'timestamp', 'application/json', '"body"');
            chai_1.expect(result2).to.equal('DC1-HMAC-SHA256 keyId:PkVjUxWZr6ST4xh+JxYFZresaFhQbk8sggWqyWv/XkU=');
        });
    });
});

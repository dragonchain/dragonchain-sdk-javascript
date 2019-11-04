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
var crypto = require("crypto");
var config_service_1 = require("../config-service");
/**
 * @hidden
 * Service to store Dragonchain credentials and generate authentication for use in API requests
 */
var CredentialService = /** @class */ (function () {
    /**
     * Construct a CredentialService object (This should not be called directly, and instead should be constructed with createCredentials)
     */
    function CredentialService(dragonchainId, credentials, hmacAlgo) {
        var _this = this;
        /**
         * Return the HMAC signature used as the Authorization Header on REST requests to your dragonchain.
         */
        this.getAuthorizationHeader = function (method, path, timestamp, contentType, body) {
            var message = CredentialService.getHmacMessageString(method, path, _this.dragonchainId, timestamp, contentType, body, _this.hmacAlgo);
            var hmac = crypto.createHmac(_this.hmacAlgo, _this.credentials.authKey);
            var signature = hmac.update(message).digest('base64');
            return "DC1-HMAC-" + _this.hmacAlgo + " " + _this.credentials.authKeyId + ":" + signature;
        };
        this.dragonchainId = dragonchainId;
        this.credentials = credentials;
        this.hmacAlgo = hmacAlgo;
    }
    /**
     * async constructor to return an initialized CredentialService instantiation
     */
    CredentialService.createCredentials = function (dragonchainId, authKey, authKeyId, hmacAlgo, injected) {
        if (authKey === void 0) { authKey = ''; }
        if (authKeyId === void 0) { authKeyId = ''; }
        if (hmacAlgo === void 0) { hmacAlgo = 'SHA256'; }
        if (injected === void 0) { injected = { getDragonchainCredentials: config_service_1.getDragonchainCredentials }; }
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var credentials;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(!authKey || !authKeyId)) return [3 /*break*/, 2];
                        return [4 /*yield*/, injected.getDragonchainCredentials(dragonchainId)];
                    case 1:
                        credentials = _a.sent();
                        authKey = credentials.authKey;
                        authKeyId = credentials.authKeyId;
                        _a.label = 2;
                    case 2: return [2 /*return*/, new CredentialService(dragonchainId, { authKey: authKey, authKeyId: authKeyId }, hmacAlgo)];
                }
            });
        });
    };
    /**
     * transform a DragonchainRequestObject into a compliant hmac message string
     */
    CredentialService.getHmacMessageString = function (method, path, dragonchainId, timestamp, contentType, body, hmacAlgo) {
        var binaryBody = Buffer.from(body || '', 'utf-8');
        var hashedBase64Content = crypto
            .createHash(hmacAlgo)
            .update(binaryBody)
            .digest('base64');
        return [method.toUpperCase(), path, dragonchainId, timestamp, contentType, hashedBase64Content].join('\n');
    };
    return CredentialService;
}());
exports.CredentialService = CredentialService;

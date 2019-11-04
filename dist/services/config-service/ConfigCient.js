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
var fs_1 = require("fs");
var util_1 = require("util");
var os_1 = require("os");
var path = require("path");
var ini = require("ini");
var node_fetch_1 = require("node-fetch");
var FailureByDesign_1 = require("../../errors/FailureByDesign");
var index_1 = require("../../index");
/**
 * @hidden
 */
var readFileAsync = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
    return [2 /*return*/, ''];
}); }); };
if (fs_1.readFile)
    readFileAsync = util_1.promisify(fs_1.readFile);
/**
 * @hidden
 * Get the path for the configuration file depending on the OS
 * @returns {string} dragonchain configuration file path
 * @example e.g.: "~/.dragonchain/credentials" or "%LOCALAPPDATA%\dragonchain\credentials" on Windows
 */
var getConfigFilePath = function (injected) {
    if (injected === void 0) { injected = { platform: os_1.platform, homedir: os_1.homedir }; }
    if (injected.platform() === 'win32') {
        return path.join(process.env.LOCALAPPDATA || '', 'dragonchain', 'credentials');
    }
    return path.join(injected.homedir(), '.dragonchain', 'credentials');
};
exports.getConfigFilePath = getConfigFilePath;
/**
 * @hidden
 * Get the endpoint for a dragonchain from environment variables
 * @returns {string} Dragonchain enpdoint if found, empty string if not
 */
var getIdFromEnvVars = function () {
    return process.env.DRAGONCHAIN_ID || '';
};
exports.getIdFromEnvVars = getIdFromEnvVars;
/**
 * @hidden
 * get the endpoint for a dragonchain from environment variables
 * @returns {string} Dragonchain enpdoint if found, empty string if not
 */
var getEndpointFromEnvVars = function () {
    return process.env.DRAGONCHAIN_ENDPOINT || '';
};
exports.getEndpointFromEnvVars = getEndpointFromEnvVars;
/**
 * @hidden
 * get the credentials for a dragonchain from environment variables
 * @returns {DragonchainCredentials} Dragonchain enpdoint if found, false if not
 */
var getCredsFromEnvVars = function () {
    var authKey = process.env.AUTH_KEY;
    var authKeyId = process.env.AUTH_KEY_ID;
    if (!authKey || !authKeyId)
        return false;
    return { authKey: authKey, authKeyId: authKeyId };
};
exports.getCredsFromEnvVars = getCredsFromEnvVars;
/**
 * @hidden
 * get the default dragonchain ID from the configuration file
 * @returns {Promise<string>} dragonchain ID if found in file, empty string if not
 */
var getIdFromFile = function (injected) {
    if (injected === void 0) { injected = { readFileAsync: readFileAsync }; }
    return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var config, _a, _b, e_1;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    config = {};
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    _b = (_a = ini).parse;
                    return [4 /*yield*/, injected.readFileAsync(getConfigFilePath(), 'utf-8')];
                case 2:
                    config = _b.apply(_a, [_c.sent()]);
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _c.sent();
                    index_1.logger.debug("Error loading ID from config file " + e_1);
                    return [2 /*return*/, ''];
                case 4: return [2 /*return*/, config.default && config.default.dragonchain_id ? config.default.dragonchain_id : ''];
            }
        });
    });
};
exports.getIdFromFile = getIdFromFile;
/**
 * @hidden
 * get the dragonchain endpoint from the configuration file
 * @returns {Promise<string>} dragonchain endpoint if found in file, empty string if not
 */
var getEndpointFromFile = function (dragonchainId, injected) {
    if (injected === void 0) { injected = { readFileAsync: readFileAsync }; }
    return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var config, _a, _b, e_2;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    config = {};
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    _b = (_a = ini).parse;
                    return [4 /*yield*/, injected.readFileAsync(getConfigFilePath(), 'utf-8')];
                case 2:
                    config = _b.apply(_a, [_c.sent()]);
                    return [3 /*break*/, 4];
                case 3:
                    e_2 = _c.sent();
                    index_1.logger.debug("Error loading from config file " + e_2);
                    return [2 /*return*/, ''];
                case 4: return [2 /*return*/, config[dragonchainId] && config[dragonchainId].endpoint ? config[dragonchainId].endpoint : ''];
            }
        });
    });
};
exports.getEndpointFromFile = getEndpointFromFile;
/**
 * @hidden
 * get the dragonchain credentials from the configuration file
 * @returns {Promise<DragonchainCredentials>} dragonchain credentials if found in file, false if not
 */
var getCredsFromFile = function (dragonchainId, injected) {
    if (injected === void 0) { injected = { readFileAsync: readFileAsync }; }
    return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var config, _a, _b, e_3, _c, auth_key, auth_key_id;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    config = {};
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    _b = (_a = ini).parse;
                    return [4 /*yield*/, injected.readFileAsync(getConfigFilePath(), 'utf-8')];
                case 2:
                    config = _b.apply(_a, [_d.sent()]);
                    return [3 /*break*/, 4];
                case 3:
                    e_3 = _d.sent();
                    index_1.logger.debug("Error loading credentials from config file " + e_3);
                    return [2 /*return*/, false];
                case 4:
                    if (!config[dragonchainId])
                        return [2 /*return*/, false];
                    _c = config[dragonchainId], auth_key = _c.auth_key, auth_key_id = _c.auth_key_id;
                    if (!auth_key || !auth_key_id)
                        return [2 /*return*/, false];
                    return [2 /*return*/, {
                            authKey: auth_key,
                            authKeyId: auth_key_id
                        }];
            }
        });
    });
};
exports.getCredsFromFile = getCredsFromFile;
/**
 * @hidden
 * use a remote service to fetch the endpoint of a dragonchain by id
 * @param {string} dragonchainId dragonchainId to request endpoint for
 * @returns {Promise<string>} the endpoint of the dragonchain
 * @throws {FailureByDesign<NOT_FOUND>} if unable to contact remote service or not found
 */
var getEndpointFromRemote = function (dragonchainId, injected) {
    if (injected === void 0) { injected = { fetch: node_fetch_1.default }; }
    return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var result, json, endpoint, e_4;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, injected.fetch("https://matchmaking.api.dragonchain.com/registration/" + dragonchainId, { timeout: 30000 })];
                case 1:
                    result = _a.sent();
                    json = result.json();
                    endpoint = json.url;
                    if (!endpoint)
                        throw new Error("Bad response from remote service " + json); // Caught and re-thrown below
                    return [2 /*return*/, endpoint];
                case 2:
                    e_4 = _a.sent();
                    throw new FailureByDesign_1.FailureByDesign('NOT_FOUND', "Failure to retrieve dragonchain endpoint from remote service " + e_4);
                case 3: return [2 /*return*/];
            }
        });
    });
};
exports.getEndpointFromRemote = getEndpointFromRemote;
/**
 * @hidden
 * get credentials for a dragonchain from the standard location for a smart contract
 * @returns {Promise<DragonchainCredentials>} dragonchain credentials if found, false if not
 */
var getCredsAsSmartContract = function (injected) {
    if (injected === void 0) { injected = { readFileAsync: readFileAsync }; }
    return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var authKeyId, authKey, basePath, e_5;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    authKeyId = '';
                    authKey = '';
                    basePath = path.join('/', 'var', 'openfaas', 'secrets');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, injected.readFileAsync(path.join(basePath, "sc-" + process.env.SMART_CONTRACT_ID + "-auth-key-id"), 'utf-8')];
                case 2:
                    authKeyId = _a.sent();
                    return [4 /*yield*/, injected.readFileAsync(path.join(basePath, "sc-" + process.env.SMART_CONTRACT_ID + "-secret-key"), 'utf-8')];
                case 3:
                    authKey = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_5 = _a.sent();
                    index_1.logger.debug("Error loading credentials from SC location " + e_5);
                    return [2 /*return*/, false];
                case 5:
                    if (!authKeyId || !authKey)
                        return [2 /*return*/, false];
                    return [2 /*return*/, { authKey: authKey, authKeyId: authKeyId }];
            }
        });
    });
};
exports.getCredsAsSmartContract = getCredsAsSmartContract;
/**
 * Get the default configured dragonchainId from environment/config file
 * @returns {Promise<string>}
 * @throws {FailureByDesign<NOT_FOUND>}
 */
var getDragonchainId = function (injected) {
    if (injected === void 0) { injected = { getIdFromEnvVars: getIdFromEnvVars, getIdFromFile: getIdFromFile }; }
    return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var dragonchainId;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    index_1.logger.debug('Checking if dragonchain_id is in the environment');
                    dragonchainId = injected.getIdFromEnvVars();
                    if (dragonchainId)
                        return [2 /*return*/, dragonchainId];
                    index_1.logger.debug('Dragonchain ID not provided in environment, will search on disk');
                    return [4 /*yield*/, injected.getIdFromFile()];
                case 1:
                    dragonchainId = _a.sent();
                    if (dragonchainId)
                        return [2 /*return*/, dragonchainId];
                    throw new FailureByDesign_1.FailureByDesign('NOT_FOUND', 'Configuration file is missing a default id');
            }
        });
    });
};
exports.getDragonchainId = getDragonchainId;
/**
 * @hidden
 * Get the endpoint for a dragonchain. First checks environment, then configuration files, then a remote service
 * @param {string} dragonchainId dragonchainId to get endpoint for
 * @returns {Promise<string>} Endpoint of the dragonchain
 * @throws {FailureByDesign<NOT_FOUND>}
 */
var getDragonchainEndpoint = function (dragonchainId, injected) {
    if (injected === void 0) { injected = { getEndpointFromEnvVars: getEndpointFromEnvVars, getEndpointFromFile: getEndpointFromFile, getEndpointFromRemote: getEndpointFromRemote }; }
    return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var endpoint;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    endpoint = injected.getEndpointFromEnvVars();
                    if (endpoint)
                        return [2 /*return*/, endpoint];
                    index_1.logger.debug("Endpoint isn't in environment, trying to load from ini config file");
                    return [4 /*yield*/, injected.getEndpointFromFile(dragonchainId)];
                case 1:
                    endpoint = _a.sent();
                    if (endpoint)
                        return [2 /*return*/, endpoint];
                    index_1.logger.debug("Endpoint isn't in config file, trying to load from remote service");
                    return [2 /*return*/, injected.getEndpointFromRemote(dragonchainId)]; // This will throw NOT_FOUND if necessary
            }
        });
    });
};
exports.getDragonchainEndpoint = getDragonchainEndpoint;
/**
 * Get the credentials for a dragonchain. First checks environment, then configuration files, then a smart contract location
 * @param {string} dragonchainId dragonchainId to get credentials for
 * @returns {DragonchainCredentials} Credentials of the dragonchain
 * @throws {FailureByDesign<NOT_FOUND>}
 */
var getDragonchainCredentials = function (dragonchainId, injected) {
    if (injected === void 0) { injected = { getCredsFromEnvVars: getCredsFromEnvVars, getCredsFromFile: getCredsFromFile, getCredsAsSmartContract: getCredsAsSmartContract }; }
    return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var credentials;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    credentials = injected.getCredsFromEnvVars();
                    if (credentials)
                        return [2 /*return*/, credentials];
                    index_1.logger.debug("Credentials aren't in environment, trying to load from ini config file");
                    return [4 /*yield*/, injected.getCredsFromFile(dragonchainId)];
                case 1:
                    credentials = _a.sent();
                    if (credentials)
                        return [2 /*return*/, credentials];
                    index_1.logger.debug("Credentials aren't in config file, trying to load as a smart contract");
                    return [4 /*yield*/, injected.getCredsAsSmartContract()];
                case 2:
                    credentials = _a.sent();
                    if (credentials)
                        return [2 /*return*/, credentials];
                    throw new FailureByDesign_1.FailureByDesign('NOT_FOUND', "Credentials for " + dragonchainId + " could not be found");
            }
        });
    });
};
exports.getDragonchainCredentials = getDragonchainCredentials;

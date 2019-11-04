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
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * Error class thrown by the SDK
 * All expected errors thrown by the SDK should be an instantiation of this class, with different codes as appropriate
 */
var FailureByDesign = /** @class */ (function (_super) {
    tslib_1.__extends(FailureByDesign, _super);
    function FailureByDesign(code, message) {
        var _this = _super.call(this, message) || this;
        _this.code = code;
        _this.message = message || 'Failure By Design';
        return _this;
    }
    return FailureByDesign;
}(Error));
exports.FailureByDesign = FailureByDesign;

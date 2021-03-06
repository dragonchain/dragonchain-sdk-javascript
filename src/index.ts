/**
 * Copyright 2020 Dragonchain, Inc. or its affiliates. All Rights Reserved.
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

import { createClient, DragonchainClient as Client } from './services/dragonchain-client/DragonchainClient';

/**
 * @hidden
 */
const nullLog = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
/**
 * @hidden
 */
let logger: any; // singleton logger

/**
 * Set the logger that the sdk uses
 *
 * By default this logger will do nothing, thorwing away all logs
 * @param newLogger a logger object that implements functions for: `log`, `info`, `warn`, `error`, and `debug`
 */
const setLogger = (newLogger: any = { log: nullLog, info: nullLog, warn: nullLog, error: nullLog, debug: nullLog }) => {
  logger = newLogger;
};

setLogger(); // actually initialize the singleton on initial import

export { createClient, setLogger, logger };
export * from './interfaces/DragonchainClientInterfaces';
export type DragonchainClient = Client;

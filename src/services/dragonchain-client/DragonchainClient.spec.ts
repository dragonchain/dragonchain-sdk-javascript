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

import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import { stub, assert, useFakeTimers } from 'sinon';
import { DragonchainClient } from './DragonchainClient';
import { CredentialService } from '../credential-service/CredentialService';
const expect = chai.expect;
chai.use(sinonChai);
const fakeTime = `${new Date().toISOString().slice(0, -1)}${Math.floor(Math.random() * 900) + 100}Z`;
const fakeTimeStamp = Date.now();
useFakeTimers({ now: fakeTimeStamp, shouldAdvanceTime: false });
stub(DragonchainClient.prototype, 'getTimestamp').returns(fakeTime);

describe('DragonchainClient', () => {
  describe('#constructor', () => {
    it('returns instance of DragonchainClient', () => {
      const client = new DragonchainClient('banana', new CredentialService('id', { authKey: 'key', authKeyId: 'keyId' }, 'SHA256'), true);
      expect(client instanceof DragonchainClient).to.equal(true);
    });
  });

  describe('GET', () => {
    let fakeResponseObj;
    let fetch: any;
    let readFileAsync: any;
    let CredentialService: any;
    let logger: any;
    let client: DragonchainClient;
    let expectedFetchOptions: any;
    let fakeResponseText: string;
    let fakeSecretText: string;

    beforeEach(() => {
      fakeResponseObj = { body: 'fakeResponseBody' };
      fakeResponseText = 'fakeString';
      fakeSecretText = 'fakeSecret';
      fetch = stub().resolves({ status: 200, json: stub().resolves(fakeResponseObj), text: stub().resolves(fakeResponseText) });
      readFileAsync = stub().returns(fakeSecretText);
      CredentialService = { getAuthorizationHeader: stub().returns('fakeCreds'), dragonchainId: 'fakeDragonchainId' };
      logger = { log: stub(), debug: stub() };
      const injected = { logger, fetch, readFileAsync };

      client = new DragonchainClient('fakeUrl', CredentialService, true, injected);
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

    describe('.getSmartContractSecret', () => {
      it('calls readFileAsync with correct dragonchain id and secret name', async () => {
        process.env.SMART_CONTRACT_ID = 'fakeSmartContractId';
        await client.getSmartContractSecret({ secretName: 'fakeSecretName' });
        assert.calledWith(readFileAsync, '/var/openfaas/secrets/sc-fakeSmartContractId-fakeSecretName', 'utf-8');
      });
    });

    describe('.getStatus', () => {
      it('calls #fetch() with correct params', async () => {
        await client.getStatus();
        assert.calledWith(fetch, 'fakeUrl/v1/status', expectedFetchOptions);
      });
    });

    describe('.getApiKey', () => {
      it('calls #fetch() with correct params', async () => {
        await client.getApiKey({ keyId: 'MyKeyID' });
        assert.calledWith(fetch, 'fakeUrl/v1/api-key/MyKeyID', expectedFetchOptions);
      });
    });

    describe('.listApiKeys', () => {
      it('calls #fetch() with correct params', async () => {
        await client.listApiKeys();
        assert.calledWith(fetch, 'fakeUrl/v1/api-key', expectedFetchOptions);
      });
    });

    describe('.getTransaction', () => {
      it('calls #fetch() with correct params', async () => {
        const id = 'batman-transaction-id';
        await client.getTransaction({ transactionId: id });
        assert.calledWith(fetch, `fakeUrl/v1/transaction/${id}`, expectedFetchOptions);
      });
    });

    describe('.getBlock', () => {
      it('calls #fetch() with correct params', async () => {
        const id = 'robin-block-id';
        await client.getBlock({ blockId: id });
        assert.calledWith(fetch, `fakeUrl/v1/block/${id}`, expectedFetchOptions);
      });
    });

    describe('.getSmartContract', () => {
      it('calls #fetch() with correct params', async () => {
        const id = 'joker-smartcontract-id';
        await client.getSmartContract({ smartContractId: id });
        assert.calledWith(fetch, `fakeUrl/v1/contract/${id}`, expectedFetchOptions);
      });
    });

    describe('.getPublicBlockchainAddresses', () => {
      it('calls #fetch() with correct params', async () => {
        await client.getPublicBlockchainAddresses();
        assert.calledWith(fetch, 'fakeUrl/v1/public-blockchain-address', expectedFetchOptions);
      });
    });

    describe('.getPendingVerifications', () => {
      it('calls #fetch() with correct params', async () => {
        const id = 'block_id';
        await client.getPendingVerifications({ blockId: id });
        assert.calledWith(fetch, `fakeUrl/v1/verifications/pending/${id}`, expectedFetchOptions);
      });
    });

    describe('.getSmartContractObject', () => {
      it('calls #fetch() with correct params', async () => {
        const key = 'myKey';
        await client.getSmartContractObject({ key });
        assert.calledWith(fetch, `fakeUrl/v1/get/fakeSmartContractId/${key}`, expectedFetchOptions);
      });

      describe('.getSmartContractObject', () => {
        before(() => {
          process.env.DRAGONCHAIN_ENV = 'test';
        });

        after(() => {
          process.env.DRAGONCHAIN_ENV = undefined;
        });

        it('fails to read from the file system correctly', async () => {
          const key = 'myKey';
          const x = await client.getSmartContractObject({ key });
          expect(x).to.deep.equal({ status: 404, response: 'null', ok: false });
        });
      });
    });

    describe('.getVerifications', () => {
      it('calls #fetch() with correct params', async () => {
        const id = 'block_id';
        await client.getVerifications({ blockId: id });
        assert.calledWith(fetch, `fakeUrl/v1/verifications/${id}`, expectedFetchOptions);
      });
    });

    describe('.queryTransactions', () => {
      it('calls #fetch() with correct params', async () => {
        await client.queryTransactions({
          transactionType: 'testing',
          redisearchQuery: 'banana',
          verbatim: false,
          limit: 2,
          offset: 1,
          idsOnly: false,
          sortAscending: false,
          sortBy: 'whatever'
        });
        assert.calledWith(
          fetch,
          'fakeUrl/v1/transaction?transaction_type=testing&q=banana&offset=1&limit=2&verbatim=false&id_only=false&sort_by=whatever&sort_asc=false',
          expectedFetchOptions
        );
      });

      it('defaults offset and limit', async () => {
        await client.queryTransactions({
          transactionType: 'test',
          redisearchQuery: 'yeah'
        });
        assert.calledWith(fetch, 'fakeUrl/v1/transaction?transaction_type=test&q=yeah&offset=0&limit=10', expectedFetchOptions);
      });
    });

    describe('.queryBlocks', () => {
      it('calls #fetch() with correct params', async () => {
        await client.queryBlocks({ redisearchQuery: 'banana', limit: 2, offset: 1, idsOnly: false, sortAscending: false, sortBy: 'something' });
        assert.calledWith(fetch, `fakeUrl/v1/block?q=banana&offset=1&limit=2&id_only=false&sort_by=something&sort_asc=false`, expectedFetchOptions);
      });

      it('defaults offset and limit', async () => {
        await client.queryBlocks({
          redisearchQuery: 'yeah'
        });
        assert.calledWith(fetch, 'fakeUrl/v1/block?q=yeah&offset=0&limit=10', expectedFetchOptions);
      });
    });

    describe('.listSmartContracts', () => {
      it('calls #fetch() with correct params', async () => {
        await client.listSmartContracts();
        assert.calledWith(fetch, `fakeUrl/v1/contract`, expectedFetchOptions);
      });
    });

    describe('.getSmartContractLogs', () => {
      it('calls #fetch() with correct params', async () => {
        await client.getSmartContractLogs({ smartContractId: 'test', tail: 100, since: 'a-date' });
        assert.calledWith(fetch, `fakeUrl/v1/contract/test/logs?tail=100&since=a-date`, expectedFetchOptions);
      });

      it('calls #fetch() with correct params and missing erroneous ?', async () => {
        await client.getSmartContractLogs({ smartContractId: 'test' });
        assert.calledWith(fetch, `fakeUrl/v1/contract/test/logs`, expectedFetchOptions);
      });
    });

    describe('.getInterchainNetwork', () => {
      it('calls #fetch() with correct params', async () => {
        await client.getInterchainNetwork({ blockchain: 'bitcoin', name: 'banana' });
        assert.calledWith(fetch, 'fakeUrl/v1/interchains/bitcoin/banana');
      });
    });

    describe('.listInterchainNetworks', () => {
      it('calls #fetch() with correct params', async () => {
        await client.listInterchainNetworks({ blockchain: 'bitcoin' });
        assert.calledWith(fetch, 'fakeUrl/v1/interchains/bitcoin');
      });
    });

    describe('.getDefaultInterchainNetwork', () => {
      it('calls #fetch() with correct params', async () => {
        await client.getDefaultInterchainNetwork();
        assert.calledWith(fetch, 'fakeUrl/v1/interchains/default');
      });
    });
  });

  describe('DELETE', () => {
    const fakeResponseObj = { body: 'fakeResponseBody' };
    const fakeResponseText = 'fakeString';
    const fetch = stub().resolves({ status: 200, json: stub().resolves(fakeResponseObj), text: stub().resolves(fakeResponseText) });
    const CredentialService: any = { getAuthorizationHeader: stub().returns('fakeCreds'), dragonchainId: 'fakeDragonchainId' };
    const logger = { log: stub(), debug: stub() };
    const injected = { logger, fetch };
    const client = new DragonchainClient('fakeUrl', CredentialService, true, injected);
    const expectedFetchOptions = {
      method: 'DELETE',
      credentials: 'omit',
      headers: {
        dragonchain: 'fakeDragonchainId',
        Authorization: 'fakeCreds',
        timestamp: fakeTime
      },
      body: undefined
    };

    describe('.deleteSmartContract', () => {
      it('calls #fetch() with correct params', async () => {
        const param = 'banana';
        await client.deleteSmartContract({ smartContractId: param });
        assert.calledWith(fetch, 'fakeUrl/v1/contract/banana', expectedFetchOptions);
      });
    });

    describe('.deleteApiKey', () => {
      it('calls #fetch() with correct params', async () => {
        await client.deleteApiKey({ keyId: 'MyKeyID' });
        assert.calledWith(fetch, 'fakeUrl/v1/api-key/MyKeyID', expectedFetchOptions);
      });
    });

    describe('.deleteInterchainNetwork', () => {
      it('calls #fetch() with correct params', async () => {
        await client.deleteInterchainNetwork({ blockchain: 'bitcoin', name: 'banana' });
        assert.calledWith(fetch, 'fakeUrl/v1/interchains/bitcoin/banana');
      });
    });
  });

  describe('POST', () => {
    const fakeResponseObj = { body: 'fakeResponseBody' };
    const fakeResponseText = 'fakeString';
    const fetch = stub().resolves({ status: 200, json: stub().resolves(fakeResponseObj), text: stub().resolves(fakeResponseText) });
    const CredentialService: any = { getAuthorizationHeader: stub().returns('fakeCreds'), dragonchainId: 'fakeDragonchainId' };
    const logger = { log: stub(), debug: stub() };
    const injected = { logger, CredentialService, fetch };

    const client = new DragonchainClient('fakeUrl', CredentialService, true, injected);
    const expectedFetchOptions = {
      method: 'POST',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        dragonchain: 'fakeDragonchainId',
        Authorization: 'fakeCreds',
        timestamp: fakeTime
      }
    };

    describe('.createApiKey', () => {
      it('calls #fetch() with correct params', async () => {
        await client.createApiKey();
        const expectedBody = {};
        assert.calledWith(fetch, 'fakeUrl/v1/api-key', { ...expectedFetchOptions, body: JSON.stringify(expectedBody) });
      });
    });

    describe('.createTransaction', () => {
      it('calls #fetch() with correct params', async () => {
        const transactionCreatePayload = {
          transactionType: 'transaction',
          payload: 'hi!',
          tag: 'Awesome!'
        };
        const expectedBody = {
          version: '1',
          txn_type: transactionCreatePayload.transactionType,
          payload: transactionCreatePayload.payload,
          tag: transactionCreatePayload.tag
        };
        await client.createTransaction(transactionCreatePayload);
        const obj = { ...expectedFetchOptions, body: JSON.stringify(expectedBody) };
        assert.calledWith(fetch, 'fakeUrl/v1/transaction', obj);
      });
    });

    describe('.createTransactionType', () => {
      it('calls #fetch() with correct params', async () => {
        const expectedBody = {
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
        await client.createTransactionType({
          transactionType: 'testing',
          customIndexFields: [{ path: 'testPath', fieldName: 'someField', type: 'text', options: { noIndex: false, sortable: true, weight: 0.5 } }]
        });
        const obj = { ...expectedFetchOptions, body: JSON.stringify(expectedBody) };
        assert.calledWith(fetch, 'fakeUrl/v1/transaction-type', obj);
      });
    });

    describe('.createSmartContract', () => {
      it('create custom contract successfully', async () => {
        const contractPayload = {
          transactionType: 'name',
          image: 'ubuntu:latest',
          environmentVariables: { banana: 'banana', apple: 'banana' },
          cmd: 'banana',
          args: ['-m', 'cool']
        };
        const expectedBody = {
          version: '3',
          txn_type: 'name',
          image: contractPayload.image,
          execution_order: 'parallel',
          cmd: contractPayload.cmd,
          args: contractPayload.args,
          env: contractPayload.environmentVariables
        };
        await client.createSmartContract(contractPayload);
        const obj = { ...expectedFetchOptions, body: JSON.stringify(expectedBody) };
        assert.calledWith(fetch, 'fakeUrl/v1/contract', obj);
      });
    });

    describe('.createEthereumTransaction', () => {
      it('calls #fetch() with correct params', async () => {
        const transactionCreatePayload: any = {
          network: 'ETH_MAINNET',
          to: '0x0000000000000000000000000000000000000000',
          value: '0x0',
          data: '0x111',
          gasPrice: '0x222',
          gas: '0x333'
        };
        const expectedBody = {
          network: transactionCreatePayload.network,
          transaction: {
            to: transactionCreatePayload.to,
            value: transactionCreatePayload.value,
            data: transactionCreatePayload.data,
            gasPrice: transactionCreatePayload.gasPrice,
            gas: transactionCreatePayload.gas
          }
        };
        await client.createEthereumTransaction(transactionCreatePayload);
        const obj = { ...expectedFetchOptions, body: JSON.stringify(expectedBody) };
        assert.calledWith(fetch, 'fakeUrl/v1/public-blockchain-transaction', obj);
      });
    });

    describe('.createBitcoinInterchain', () => {
      it('calls #fetch() with correct params', async () => {
        const fakeBody: any = {
          version: '1',
          name: 'banana',
          testnet: true,
          private_key: 'abcd',
          rpc_address: 'some rpc',
          rpc_authorization: 'some auth',
          utxo_scan: false
        };
        await client.createBitcoinInterchain({ name: 'banana', testnet: true, privateKey: 'abcd', rpcAddress: 'some rpc', rpcAuthorization: 'some auth', utxoScan: false });
        const obj = { ...expectedFetchOptions, body: JSON.stringify(fakeBody) };
        assert.calledWith(fetch, 'fakeUrl/v1/interchains/bitcoin', obj);
      });
    });

    describe('.createEthereumInterchain', () => {
      it('calls #fetch() with correct params', async () => {
        const fakeBody: any = {
          version: '1',
          name: 'banana',
          private_key: 'private key',
          rpc_address: 'some rpc',
          chain_id: 12
        };
        await client.createEthereumInterchain({ name: 'banana', privateKey: 'private key', rpcAddress: 'some rpc', chainId: 12 });
        const obj = { ...expectedFetchOptions, body: JSON.stringify(fakeBody) };
        assert.calledWith(fetch, 'fakeUrl/v1/interchains/ethereum', obj);
      });
    });

    describe('.signBitcoinTransaction', () => {
      it('calls #fetch() with correct params', async () => {
        const fakeBody: any = {
          version: '1',
          fee: 4,
          data: 'someData',
          change: 'change address',
          outputs: [{ to: 'toaddr', value: 1.234 }]
        };
        await client.signBitcoinTransaction({ name: 'banana', satoshisPerByte: 4, data: 'someData', changeAddress: 'change address', outputs: [{ to: 'toaddr', value: 1.234 }] });
        const obj = { ...expectedFetchOptions, body: JSON.stringify(fakeBody) };
        assert.calledWith(fetch, 'fakeUrl/v1/interchains/bitcoin/banana/transaction', obj);
      });
    });

    describe('.signEthereumTransaction', () => {
      it('calls #fetch() with correct params', async () => {
        const fakeBody: any = {
          version: '1',
          to: 'some addr',
          value: 'some value',
          data: 'someData',
          gasPrice: 'gas price',
          gas: 'gas',
          nonce: 'nonce'
        };
        await client.signEthereumTransaction({ name: 'banana', to: 'some addr', value: 'some value', data: 'someData', gasPrice: 'gas price', gas: 'gas', nonce: 'nonce' });
        const obj = { ...expectedFetchOptions, body: JSON.stringify(fakeBody) };
        assert.calledWith(fetch, 'fakeUrl/v1/interchains/ethereum/banana/transaction', obj);
      });
    });

    describe('.setDefaultInterchainNetwork', () => {
      it('calls #fetch() with correct params', async () => {
        const fakeBody: any = {
          version: '1',
          blockchain: 'bitcoin',
          name: 'banana'
        };
        await client.setDefaultInterchainNetwork({ name: 'banana', blockchain: 'bitcoin' });
        const obj = { ...expectedFetchOptions, body: JSON.stringify(fakeBody) };
        assert.calledWith(fetch, 'fakeUrl/v1/interchains/default', obj);
      });
    });
  });

  describe('PUT', () => {
    const fakeResponseObj = { body: 'fakeResponseBody' };
    const fakeResponseText = 'fakeString';
    const fetch = stub().resolves({ status: 200, json: stub().resolves(fakeResponseObj), text: stub().resolves(fakeResponseText) });
    const CredentialService: any = { getAuthorizationHeader: stub().returns('fakeCreds'), dragonchainId: 'fakeDragonchainId' };
    const logger = { log: stub(), debug: stub() };
    const injected = { logger, CredentialService, fetch };

    const client = new DragonchainClient('fakeUrl', CredentialService, true, injected);
    const expectedFetchOptions = {
      method: 'PUT',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        dragonchain: 'fakeDragonchainId',
        Authorization: 'fakeCreds',
        timestamp: fakeTime
      }
    };

    describe('.updateSmartContract', () => {
      it('calls #fetch() with correct params', async () => {
        const smartContractId = '616152367378';
        const status = 'active';
        const fakeBodyResponse: any = {
          version: '3',
          desired_state: status
        };
        await client.updateSmartContract({ smartContractId, enabled: true });
        const obj = { ...expectedFetchOptions, body: JSON.stringify(fakeBodyResponse) };
        assert.calledWith(fetch, `fakeUrl/v1/contract/${smartContractId}`, obj);
      });
    });
  });

  describe('PATCH', () => {
    const fakeResponseObj = { body: 'fakeResponseBody' };
    const fakeResponseText = 'fakeString';
    const fetch = stub().resolves({ status: 200, json: stub().resolves(fakeResponseObj), text: stub().resolves(fakeResponseText) });
    const CredentialService: any = { getAuthorizationHeader: stub().returns('fakeCreds'), dragonchainId: 'fakeDragonchainId' };
    const logger = { log: stub(), debug: stub() };
    const injected = { logger, CredentialService, fetch };

    const client = new DragonchainClient('fakeUrl', CredentialService, true, injected);
    const expectedFetchOptions = {
      method: 'PATCH',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        dragonchain: 'fakeDragonchainId',
        Authorization: 'fakeCreds',
        timestamp: fakeTime
      }
    };

    describe('.updateBitcoinInterchain', () => {
      it('calls #fetch() with correct params', async () => {
        const fakeBody: any = {
          version: '1',
          testnet: true,
          private_key: 'abcd',
          rpc_address: 'some rpc',
          rpc_authorization: 'some auth',
          utxo_scan: false
        };
        await client.updateBitcoinInterchain({ name: 'banana', testnet: true, privateKey: 'abcd', rpcAddress: 'some rpc', rpcAuthorization: 'some auth', utxoScan: false });
        const obj = { ...expectedFetchOptions, body: JSON.stringify(fakeBody) };
        assert.calledWith(fetch, 'fakeUrl/v1/interchains/bitcoin/banana', obj);
      });
    });

    describe('.updateEthereumInterchain', () => {
      it('calls #fetch() with correct params', async () => {
        const fakeBody: any = {
          version: '1',
          private_key: 'private key',
          rpc_address: 'some rpc',
          chain_id: 12
        };
        await client.updateEthereumInterchain({ name: 'banana', privateKey: 'private key', rpcAddress: 'some rpc', chainId: 12 });
        const obj = { ...expectedFetchOptions, body: JSON.stringify(fakeBody) };
        assert.calledWith(fetch, 'fakeUrl/v1/interchains/ethereum/banana', obj);
      });
    });
  });
});

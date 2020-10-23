/*
  Unit tests for the main index.js file.
*/

// External npm libraries
const assert = require('chai').assert
const sinon = require('sinon')

// Local libraries
const SplitLib = require('../../index')

let sandbox
let uut

describe('#index.js', () => {
  // Wallets used for testing.
  const receiverWIF = 'L22cDXNCqu2eWsGrZw7esnTyE91R7eZA1o7FND6pLGuEXrV8z4B8'
  const paperWIF = 'KyvkSiN6gWjQenpkKSQzDh1JphuBYhsanGN5ZCL6bTy81fJL8ank'

  // Restore the sandbox before each test.
  beforeEach(() => {
    sandbox = sinon.createSandbox()

    uut = new SplitLib(paperWIF, receiverWIF)
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should instantiate the sweep library', () => {
      uut = new SplitLib(paperWIF, receiverWIF)

      assert.property(uut, 'abcSweeper')
      assert.property(uut, 'bchnSweeper')
    })

    it('should throw an error if paper wallet wif is not included', () => {
      try {
        uut = new SplitLib()

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'WIF from paper wallet is required')
      }
    })

    it('should throw an error if receiver wallet wif is not included', () => {
      try {
        uut = new SplitLib(paperWIF)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'WIF from receiver is required')
      }
    })
  })

  describe('#getBlockchainData', () => {
    // Simply goes through the motions to make sure the flow is as expected.
    it('should populate blockchain data', async () => {
      sandbox.stub(uut.abcSweeper, 'populateObjectFromNetwork').resolves({})
      sandbox.stub(uut.bchnSweeper, 'populateObjectFromNetwork').resolves({})

      await uut.getBlockchainData()

      assert.property(uut.abcSweeper.receiver, 'balance')
    })

    it('should handle errors', async () => {
      try {
        sandbox
          .stub(uut.abcSweeper, 'populateObjectFromNetwork')
          .rejects(new Error('test error'))

        await uut.getBlockchainData()

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })

  // describe('#populateObjectFromNetwork', () => {
  //   it('should populate the instance with UTXO data', async () => {
  //     // Mock the function that make network calls.
  //     mockUtxos()
  //
  //     await uut.populateObjectFromNetwork()
  //     // console.log('uut: ', uut)
  //
  //     // Assert that the instance has the balance and utxo information.
  //     assert.equal(uut.BCHBalanceFromReceiver, 10000)
  //     assert.equal(uut.BCHBalanceFromPaperWallet, 546)
  //
  //     assert.equal(
  //       uut.UTXOsFromReceiver.bchUTXOs,
  //       mockData.filteredUtxosFromReceiver.bchUTXOs
  //     )
  //     assert.equal(
  //       uut.UTXOsFromPaperWallet.tokenUTXOs,
  //       mockData.filteredUtxosFromPaperWallet.tokenUTXOs
  //     )
  //     assert.equal(
  //       uut.UTXOsFromPaperWallet.bchUTXOs,
  //       mockData.filteredUtxosFromPaperWallet.bchUTXOs
  //     )
  //   })
  //
  //   it('should handle and throw an error', async () => {
  //     try {
  //       sandbox
  //         .stub(uut.blockchain, 'getBalanceForCashAddr')
  //         .rejects(new Error('test error'))
  //
  //       // Populate the instance with UTXO data.
  //       await uut.populateObjectFromNetwork()
  //
  //       assert.equal(true, false, 'Unexpect result')
  //     } catch (err) {
  //       // console.log(err)
  //       assert.include(err.message, 'test error')
  //     }
  //   })
  // })
  //
  // describe('#getTokenIds', () => {
  //   it('should return token ID for a single UTXO', () => {
  //     const result = uut.getTokenIds(
  //       mockData.filteredUtxosFromPaperWallet.tokenUTXOs
  //     )
  //     // console.log(`result: ${JSON.stringify(result, null, 2)}`)
  //
  //     assert.isArray(result)
  //     assert.equal(result.length, 1)
  //   })
  //
  //   it('should return token IDs for two token class UTXOs', () => {
  //     const result = uut.getTokenIds(mockData.mockTwoTokenUtxos)
  //     // console.log(`result: ${JSON.stringify(result, null, 2)}`)
  //
  //     assert.isArray(result)
  //     assert.equal(result.length, 2)
  //   })
  //
  //   it('should throw an error if input is not an array', () => {
  //     try {
  //       uut.getTokenIds('12345')
  //
  //       assert.equal(true, false, 'Unexpected result')
  //     } catch (err) {
  //       // console.log(err)
  //       assert.include(err.message, 'Input must be an array')
  //     }
  //   })
  //
  //   it('should return an empty array if given an empty array', () => {
  //     const result = uut.getTokenIds([])
  //
  //     assert.equal(result.length, 0)
  //   })
  // })
  //
  // describe('#sweepTo', () => {
  //   it('should throw an error if paper wallet has no tokens or BCH', async () => {
  //     try {
  //       // Mock the function that make network calls.
  //       mockUtxos()
  //
  //       // Populate the instance with UTXO data.
  //       await uut.populateObjectFromNetwork()
  //
  //       // Force paper wallet UTXOs to be empty.
  //       uut.UTXOsFromPaperWallet.tokenUTXOs = []
  //       uut.UTXOsFromPaperWallet.bchUTXOs = []
  //
  //       await uut.sweepTo(uut.receiver.slpAddr)
  //     } catch (err) {
  //       // console.log(err)
  //       assert.include(err.message, 'No BCH or tokens found on paper wallet')
  //     }
  //   })
  //
  //   it('should generate a BCH-only transaction if paper wallet has no tokens', async () => {
  //     // Mock the function that make network calls.
  //     mockUtxos()
  //
  //     // Populate the instance with UTXO data.
  //     await uut.populateObjectFromNetwork()
  //
  //     // Force paper wallet token UTXOs to be empty.
  //     uut.UTXOsFromPaperWallet.tokenUTXOs = []
  //
  //     // Force paper wallet to have a BCH UTXO.
  //     uut.UTXOsFromPaperWallet.bchUTXOs =
  //       mockData.filteredUtxosFromReceiver.bchUTXOs
  //     uut.BCHBalanceFromPaperWallet = 10000
  //
  //     const hex = await uut.sweepTo(uut.receiver.slpAddr)
  //
  //     assert.isString(hex)
  //   })
  //
  //   it('should throw error if not enough BCH to pay tx fees', async () => {
  //     try {
  //       // Mock the function that make network calls.
  //       mockUtxos()
  //
  //       // Populate the instance with UTXO data.
  //       await uut.populateObjectFromNetwork()
  //
  //       // Force paper wallet token UTXOs to be empty.
  //       uut.UTXOsFromPaperWallet.tokenUTXOs = []
  //
  //       // Force paper wallet to have a BCH UTXO.
  //       uut.UTXOsFromPaperWallet.bchUTXOs =
  //         mockData.filteredUtxosFromReceiver.bchUTXOs
  //
  //       const hex = await uut.sweepTo(uut.receiver.slpAddr)
  //
  //       assert.isString(hex)
  //     } catch (err) {
  //       assert.include(err.message, 'Not enough BCH on paper wallet to pay fees')
  //     }
  //   })
  //
  //   it('should generate a token-sweep tx if paper wallet has a single token and no BCH', async () => {
  //     // Mock the function that make network calls.
  //     mockUtxos()
  //
  //     // Populate the instance with UTXO data.
  //     await uut.populateObjectFromNetwork()
  //
  //     const hex = await uut.sweepTo(uut.receiver.slpAddr)
  //
  //     assert.isString(hex)
  //   })
  //
  //   it('should generate a token-sweep tx if paper wallet has two token types and no BCH', async () => {
  //     // Mock the function that make network calls.
  //     mockUtxos()
  //
  //     // Populate the instance with UTXO data.
  //     await uut.populateObjectFromNetwork()
  //
  //     // Force paper wallet token UTXOs to contain two token types.
  //     uut.UTXOsFromPaperWallet.tokenUTXOs = mockData.mockTwoTokenUtxos
  //
  //     const hex = await uut.sweepTo(uut.receiver.slpAddr)
  //
  //     assert.isString(hex)
  //   })
  //
  //   it('should generate a token-sweep tx if paper wallet has a single token and BCH', async () => {
  //     // Mock the function that make network calls.
  //     mockUtxos()
  //
  //     // Populate the instance with UTXO data.
  //     await uut.populateObjectFromNetwork()
  //
  //     // Adjust values
  //     uut.paper = uut.blockchain.expandWif(
  //       'KxtteuKQ2enad5jH2o5eGkSaTgas49kWmvADW6qqhLAURrxuUo7m'
  //     )
  //     uut.UTXOsFromPaperWallet = mockData.mockAllPaperUtxosOneToken
  //
  //     const hex = await uut.sweepTo(uut.receiver.slpAddr)
  //
  //     assert.isString(hex)
  //   })
  //
  //   it('should generate a token-sweep tx if paper wallet has two tokens and BCH', async () => {
  //     // Mock the function that make network calls.
  //     mockUtxos()
  //
  //     // Populate the instance with UTXO data.
  //     await uut.populateObjectFromNetwork()
  //
  //     // Adjust values
  //     uut.paper = uut.blockchain.expandWif(
  //       'KxtteuKQ2enad5jH2o5eGkSaTgas49kWmvADW6qqhLAURrxuUo7m'
  //     )
  //     uut.UTXOsFromPaperWallet = mockData.mockAllPaperUtxosTwoTokens
  //
  //     const hex = await uut.sweepTo(uut.receiver.slpAddr)
  //
  //     assert.isString(hex)
  //   })
  // })
})

// Mocks the UTXOs for different tests.
// function mockUtxos () {
//   sandbox
//     .stub(uut.blockchain, 'getBalanceForCashAddr')
//     // The reciever wallet.
//     .onCall(0)
//     .resolves(10000)
//     // The paper wallet.
//     .onCall(1)
//     .resolves(546)
//   sandbox
//     .stub(uut.blockchain, 'getUtxos')
//     // The reciever wallet.
//     .onCall(0)
//     .resolves(mockData.utxosFromReceiver)
//     // The paper wallet.
//     .onCall(1)
//     .resolves(mockData.utxosFromPaperWallet)
//   sandbox
//     .stub(uut.blockchain, 'filterUtxosByTokenAndBch')
//     // The reciever wallet.
//     .onCall(0)
//     .resolves(mockData.filteredUtxosFromReceiver)
//     // The paper wallet.
//     .onCall(1)
//     .resolves(mockData.filteredUtxosFromPaperWallet)
// }

const HDWalletProvider = require("@truffle/hdwallet-provider");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "1337",
      //   gas: 8500000,
      //   gasPrice: 20000000000,
      //   from: <address>,
      //   websocket: true
    },
    ropsten: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`),
      network_id: "3",
      gas: 5500000,
      gasPrice: 10000000000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    mainnet: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`),
      network_id: "1",
      gas: 6000000,
      gasPrice: 20000000000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
  mocha: {
    timeout: 100000,
  },
  compilers: {
    solc: {
      version: "0.5.16",
      // docker: true,
      settings: {
        optimizer: {
          enabled: false,
          runs: 200,
        },
        evmVersion: "byzantium",
      },
    },
  },
};

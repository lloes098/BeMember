require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.25",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Monad 테스트넷
    monadTestnet: {
      url: process.env.MONAD_TESTNET_RPC_URL || "https://testnet-rpc.monad.xyz",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 10143, // 0x279F - Monad 테스트넷 Chain ID
      gasPrice: 10000000000, // 10 gwei (Monad 테스트넷 최소 요구사항)
    },
    // Monad 메인넷 (준비되면 사용)
    monadMainnet: {
      url: process.env.MONAD_MAINNET_RPC_URL || "https://rpc.monad.xyz",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 420, // 실제 메인넷 Chain ID로 변경 필요
      gasPrice: 1000000000,
    },
    // Monad (기본 - 테스트넷 사용)
    monad: {
      url: process.env.MONAD_RPC_URL || process.env.MONAD_TESTNET_RPC_URL || "https://testnet-rpc.monad.xyz",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 10143, // 0x279F - Monad 테스트넷 Chain ID
      gasPrice: 10000000000, // 10 gwei (Monad 테스트넷 최소 요구사항)
    },
    // 로컬 테스트용
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    // Hardhat 네트워크 (기본)
    hardhat: {
      chainId: 1337,
      // 로컬 테스트를 위한 포크 설정 (선택사항)
      // forking: {
      //   url: process.env.MONAD_TESTNET_RPC_URL || "https://testnet-rpc.monad.xyz",
      // }
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  // Sourcify 검증 설정
  sourcify: {
    enabled: true,
    apiUrl: "https://sourcify-api-monad.blockvision.org/",
    browserUrl: "https://testnet.monadexplorer.com/",
  },
  // Etherscan 검증 비활성화 (Sourcify 사용)
  etherscan: {
    enabled: false,
  },
};


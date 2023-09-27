require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const MAINNET_RPC_URL =
    process.env.MAINNET_RPC_URL ||
    process.env.ALCHEMY_MAINNET_RPC_URL ||
    "https://eth-mainnet.alchemyapi.io/v2/XQTgX9upPCjtnfkojDdQ_icc8EQVuLd5"
const RINKEBY_RPC_URL =
    process.env.RINKEBY_RPC_URL || "https://eth-rinkeby.alchemyapi.io/v2/XQTgX9upPCjtnfkojDdQ_icc8EQVuLd5"
const KOVAN_RPC_URL = process.env.KOVAN_RPC_URL || "https://eth-kovan.alchemyapi.io/v2/XQTgX9upPCjtnfkojDdQ_icc8EQVuLd5"
const POLYGON_MAINNET_RPC_URL =
    process.env.POLYGON_MAINNET_RPC_URL || "https://polygon-mainnet.alchemyapi.io/v2/XQTgX9upPCjtnfkojDdQ_icc8EQVuLd5"
const GOERLI_RPC_URL =
    process.env.GOERLI_RPC_URL || "https://eth-goerli.alchemyapi.io/v2/XQTgX9upPCjtnfkojDdQ_icc8EQVuLd5"

const OWNER_PRIVATE_KEY = process.env.OWNER_PRIVATE_KEY || "706324a48fbfcbf9f6891f7451bf63459324673e0c2b41f396c6215f10a97d30"
const HOSPITAL_PRIVATE_KEY = "0x04a5d24b8a55abdf0ad8f6fb0f4c0a4e5a8bb3e6a02c9b0f2c401e87c9d3f515";
const DOCTOR_PRIVATE_KEY = "0x6b6ca73a7c06552e746d3d2d650a8d4ad5a35ee4e3a837eeb7e774a4a20d7c23";
const PATIENT_PRIVATE_KEY = "0xf0f49ad79863bf648a18d6190782cf4c7f6a9ad1544f575efeb890c869d13ae1";


// optional
//const MNEMONIC = process.env.MNEMONIC || "your mnemonic"

// Your API key for Etherscan, obtain one at https://etherscan.io/
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "C9AU1JS3Z7KU6TVF4XA1BBEZIWAYDTFKNK"
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "DUPUUGE6FCY55KY8MS4MV3WXF98AG69U2R"
const REPORT_GAS = process.env.REPORT_GAS || false

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            // // If you want to do some forking, uncomment this
            // forking: {
            //   url: MAINNET_RPC_URL
            // }
            chainId: 31337,
            allowUnlimitedContractSize: true,
        },
        localhost: {
            chainId: 31337,
            allowUnlimitedContractSize: true,
        },
        kovan: {
            url: KOVAN_RPC_URL,
            accounts:
                OWNER_PRIVATE_KEY !== undefined
                    ? [
                          OWNER_PRIVATE_KEY,
                          HOSPITAL_PRIVATE_KEY,
                          DOCTOR_PRIVATE_KEY,
                          PATIENT_PRIVATE_KEY,
                      ]
                    : [],
            //accounts: {
            //     mnemonic: MNEMONIC,
            // },
            saveDeployments: true,
            chainId: 42,
            blockConfirmations: 6,
        },
        rinkeby: {
            url: RINKEBY_RPC_URL,
            accounts:
                OWNER_PRIVATE_KEY !== undefined
                    ? [
                          OWNER_PRIVATE_KEY,
                          HOSPITAL_PRIVATE_KEY,
                          DOCTOR_PRIVATE_KEY,
                          PATIENT_PRIVATE_KEY,
                      ]
                    : [],
            //   accounts: {
            //     mnemonic: MNEMONIC,
            //   },
            saveDeployments: true,
            chainId: 4,
            blockConfirmations: 6,
            allowUnlimitedContractSize: true,
        },

        goerli: {
            url: GOERLI_RPC_URL,
            accounts:
                OWNER_PRIVATE_KEY !== undefined
                    ? [
                          OWNER_PRIVATE_KEY,
                          HOSPITAL_PRIVATE_KEY,
                          DOCTOR_PRIVATE_KEY,
                          PATIENT_PRIVATE_KEY,
                      ]
                    : [],
            //   accounts: {
            //     mnemonic: MNEMONIC,
            //   },
            saveDeployments: true,
            chainId: 5,
            blockConfirmations: 6,
            allowUnlimitedContractSize: true,
        },

        mainnet: {
            url: MAINNET_RPC_URL,
            accounts:
                OWNER_PRIVATE_KEY !== undefined
                    ? [
                          OWNER_PRIVATE_KEY,
                          HOSPITAL_PRIVATE_KEY,
                          DOCTOR_PRIVATE_KEY,
                          PATIENT_PRIVATE_KEY,
                      ]
                    : [],
            //   accounts: {
            //     mnemonic: MNEMONIC,
            //   },
            saveDeployments: true,
            chainId: 1,
            blockConfirmations: 6,
            allowUnlimitedContractSize: true,
        },
        polygon: {
            url: POLYGON_MAINNET_RPC_URL,
            accounts:
                OWNER_PRIVATE_KEY !== undefined
                    ? [
                          OWNER_PRIVATE_KEY,
                          HOSPITAL_PRIVATE_KEY,
                          DOCTOR_PRIVATE_KEY,
                          PATIENT_PRIVATE_KEY,
                      ]
                    : [],
            saveDeployments: true,
            chainId: 137,
            blockConfirmations: 6,
            allowUnlimitedContractSize: true,
        },
    },
    etherscan: {
        // npx hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
        apiKey: {
            rinkeby: ETHERSCAN_API_KEY,
            kovan: ETHERSCAN_API_KEY,
            polygon: POLYGONSCAN_API_KEY,
            goerli: ETHERSCAN_API_KEY,
        },
    },
    gasReporter: {
        enabled: REPORT_GAS,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    },
    contractSizer: {
        runOnCompile: true,
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the 0th account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
        hospital: {
            default: 1,
        },
        doctor: {
            default: 2,
        },
        patient: {
            default: 3,
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.7",
            },
        ],
    },
    mocha: {
        timeout: 200000, // 200 seconds max for running tests
    },
}

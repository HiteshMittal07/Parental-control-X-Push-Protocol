import { ethers, providers } from "ethers";
import abi from "../contractJson/CreateWallet.json";
import abi1 from "../contractJson/Parental.json";
import abi2 from "../contractJson/push.json";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
export const contractAddress = {
  polygon_zkEVM: "0xa2202D3148ac0F0F44b0bED0153248a0524EdA8D",
  push_sepolia: "0x37c779a1564DCc0e3914aB130e0e787d93e21804",
  Sepolia_testnet: "0xe3820f03feCe5E93e54EBb44a4476E3c066ea7dE",
  arbitrum_sepolia: "coming soon",
  scroll_Sepolia: "0x08dedd26815FB34389C36aBBB90c7ae6FA957169",
  BNB_testnet: "0xe591A89874b21e4F462Bd2DdbcbF27384E872ea5",
};
export function getWeb3Provider() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return provider;
}
export async function getChainId() {
  const chainId = await window.ethereum.request({
    method: "eth_chainId",
    params: [],
  });
  return chainId;
}
export async function requestAccounts(provider) {
  const accounts = await provider.send("eth_requestAccounts", []);
  return accounts[0];
}
export const getContract = (provider, address) => {
  const contractABI = abi.abi;
  const signer = provider.getSigner();
  return new ethers.Contract(address, contractABI, signer);
};

export const getContractRead = (provider, address) => {
  const contractABI = abi.abi;
  return new ethers.Contract(address, contractABI, provider);
};

export const getParentalContract = (provider, address) => {
  const contractABI = abi1.abi;
  const signer = provider.getSigner();
  return new ethers.Contract(address, contractABI, signer);
};

export const getParentalContractRead = (provider, address) => {
  const contractABI = abi1.abi;
  return new ethers.Contract(address, contractABI, provider);
};

export const getPushContractRead = (provider, address) => {
  const contractABI = abi2.result;
  return new ethers.Contract(address, contractABI, provider);
};
export const getAddress = (Id) => {
  if (Id === "2442") {
    return contractAddress.polygon_zkEVM;
  } else if (Id === "11155111") {
    return contractAddress.push_sepolia;
  } else if (Id === "534351") {
    return contractAddress.scroll_Sepolia;
  }
};
export const getNetworkName = (Id) => {
  if (Id === "2442") {
    return "Polygon zkEVM Testnet";
  } else if (Id === "534351") {
    return "Scroll Sepolia";
  }
};
const getRpc = (Id) => {
  if (Id === "2442") {
    return "https://rpc.cardona.zkevm-rpc.com";
  } else if (Id === "534351") {
    return "https://scroll-sepolia.blockpi.network/v1/rpc/public";
  }
};
const getBlockUrl = (Id) => {
  if (Id === "2442") {
    return "https://explorer.public.zkevm-test.net/";
  } else if (Id === "534351") {
    return "https://sepolia.scrollscan.com";
  }
};
export const addNetwork = async (Id) => {
  const chainId = `0x${Number(Id).toString(16)}`;
  const rpcUrl = getRpc(Id);
  const chainName = getNetworkName(Id);
  const blockUrl = getBlockUrl(Id);
  const networkParams = {
    chainId: chainId,
    chainName: chainName, // Network name
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: [rpcUrl],
    blockExplorerUrls: [blockUrl], // Block explorer URL
  };
  window.ethereum
    .request({
      method: "wallet_addEthereumChain",
      params: [networkParams],
    })
    .then(() => {
      console.log("Custom network added to MetaMask");
    })
    .catch((error) => {
      console.error("Failed to add custom network to MetaMask:", error);
    });
};
export async function switchNetwork(selectedValue) {
  await window.ethereum
    .request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${Number(selectedValue).toString(16)}` }],
    })
    .then(() => {
      console.log("Chain ID is added in MetaMask");
    })
    .catch((error) => {
      if (error.code === 4902) {
        console.log("Chain ID is not added in MetaMask");
        addNetwork(selectedValue);
      } else {
        console.error(error);
      }
    });
}

export async function getUser(signer, owner) {
  const userAlice = await PushAPI.initialize(signer, {
    env: CONSTANTS.ENV.STAGING,
    filter: {
      channels: [`${owner}`],
    },
    account: `${owner}`,
  });
  return userAlice;
}
export async function sendNotification(userAlice, title, body) {
  await userAlice.channel.send(["*"], {
    notification: {
      title: title,
      body: body,
    },
  });
}

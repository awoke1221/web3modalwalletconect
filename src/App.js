import Web3Modal from "web3modal";
import { ethers } from 'ethers';
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import USDT_ABI from "./usdt_abi.json"; // Import USDT ABI JSON
import GRT_ABI from "./grt.abi.json"; // Import GRT ABI JSON
import './App.css';
import { useEffect, useState } from "react";

const providerOptions = {
  coinbasewallet: {
    package: CoinbaseWalletSDK, 
    options: {
      appName: "Web 3 Modal Demo",
      infuraId: process.env.INFURA_KEY 
    }
  },
  // other walets are moving hear
};

function App() {
  const [web3Provider, setWeb3Provider] = useState(null);
  const [balance, setBalance] = useState(null);
  const [usdtBalance, setUsdtBalance] = useState(null);
  const [GRTBalance, setGRTBalance] = useState(null);

  async function fetchBalance() {
    if (web3Provider) {
      const signer = web3Provider.getSigner();
      const address = await signer.getAddress();
      
      // Fetch ETH balance
      const balance = await web3Provider.getBalance(address);
      setBalance(ethers.utils.formatEther(balance));

      // Fetch USDT balance
      const usdtContractAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7'; // USDT contract address
      const usdtContract = new ethers.Contract(usdtContractAddress, USDT_ABI, signer);
      const usdtBalance = await usdtContract.balanceOf(address);
      setUsdtBalance(ethers.utils.formatUnits(usdtBalance, 6)); // USDT has 6 decimal places

      // Fetch GRT balance
      const grtContractAddress = '0xc944E90C64B2c07662A292be6244BDf05Cda44a7'; // GRT contract address
      const grtContract = new ethers.Contract(grtContractAddress, GRT_ABI, signer);
      const GRTBalance = await grtContract.balanceOf(address);
      setGRTBalance(ethers.utils.formatUnits(GRTBalance, 18)); // GRT has 18 decimal places
    }
  }
  useEffect(() => {
    fetchBalance();
  }, [web3Provider]);

  async function yourwalletConnect() {
    try {
      let web3Modal = new Web3Modal({
        cacheProvider: false,
        providerOptions
      });
      const web3modalInstance = await web3Modal.connect();
      const web3modalprovider = new ethers.providers.Web3Provider(web3modalInstance);
      if (web3modalprovider) {
        setWeb3Provider(web3modalprovider);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      {web3Provider === null ? (
        <button onClick={yourwalletConnect}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected</p>
          <p>Address: {web3Provider.provider.selectedAddress}</p>
          <p>ETH Balance: {balance} ETH</p>
          <p>USDT Balance: {usdtBalance} USDT</p>
          <p>GRT Balance: {GRTBalance} GRT</p>
        </div>
      )}
    </div>
  );
}

export default App;

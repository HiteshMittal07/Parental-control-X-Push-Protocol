import { ethers } from "ethers";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import React from "react";
import { toast } from "react-toastify";
import {
  getAddress,
  getChainId,
  getContractRead,
  getPushContractRead,
  getWeb3Provider,
  switchNetwork,
} from "../Web3/web3";

export default function CreateChannel() {
  const switchChain = async () => {
    window.ethereum.on("chainChanged", create);
    await switchNetwork("11155111");
    const chainId = getChainId();
    if (chainId == `0xAA36A7`) {
      await create();
    }
    console.log(chainId);
  };
  async function create() {
    const provider = getWeb3Provider();
    const signer = provider.getSigner();
    const userAlice = await PushAPI.initialize(signer, {
      env: CONSTANTS.ENV.STAGING,
    });
    const contractAddress = getAddress("11155111");
    const contractRead = getPushContractRead(provider, contractAddress);
    try {
      const contract = contractRead.connect(signer);
      console.log(contract);
      const amount = ethers.utils.parseEther("100");
      const tx = await contract.mint(amount);
      await tx.wait();
    } catch (error) {
      return;
    }
    try {
      const response = await userAlice.channel.create({
        name: "Parental Test Channel",
        description: "Your local channel to communicates among you",
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAz0lEQVR4AcXBsU0EQQyG0e+saWJ7oACiKYDMEZVs6GgSpC2BIhzRwAS0sgk9HKn3gpFOAv3v3V4/3+4U4Z1q5KTy42Ql940qvFONnFSGmCFmiN2+fj7uCBlihpgh1ngwcvKfwjuVIWaIGWKNB+GdauSk8uNkJfeNKryzYogZYoZY40m5b/wlQ8wQM8TayMlKeKcaOVkJ71QjJyuGmCFmiDUe+HFy4VyEd57hx0mV+0ZliBlihlgL71w4FyMnVXhnZeSkiu93qheuDDFDzBD7BcCyMAOfy204AAAAAElFTkSuQmCC",
        url: "https://parental-control07.netlify.app/",
      });
    } catch (error) {
      return;
    }
    window.ethereum.removeListener("chainChanged", create);
    window.ethereum.on("chainChanged", create2);
    const selectedValue = "1442";
    await switchNetwork(selectedValue);
  }
  const create2 = async () => {
    window.ethereum.removeListener("chainChanged", create2);
    const provider = getWeb3Provider();
    const signer = provider.getSigner();
    const contractAddress = getAddress("1442");
    const contractRead = getContractRead(provider, contractAddress);
    const contract2 = contractRead.connect(signer);
    const tx2 = await contract2.onNotification();
    await tx2.wait();

    toast.success("Channel Created Successfully");
  };

  return (
    <div className="mt-5 justify-content-center align-content-center align-items-center">
      <h1 className="text-light">Create Channel for Notifications</h1>
      <button className="btn btn-light" onClick={switchChain}>
        Create
      </button>
    </div>
  );
}

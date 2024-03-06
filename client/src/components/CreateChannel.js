import { ethers } from "ethers";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import abi2 from "../contractJson/push.json";
import abi3 from "../contractJson/CreateWallet.json";
import React, { useContext } from "react";
import { ParentalContext } from "../ParentalContext";
import { toast } from "react-toastify";

export default function CreateChannel() {
  const { contractAddress } = useContext(ParentalContext);
  const contractABI = abi3.abi;

  const switchChain = async () => {
    window.ethereum.on("chainChanged", create);

    let provider = new ethers.providers.Web3Provider(window.ethereum);
    const selectedValue = 1442;
    // Send the chain switch request
    provider.send("wallet_switchEthereumChain", [{ chainId: "0xAA36A7" }]);
    if (window.ethereum.chainId == `0xAA36A7`) {
      await create();
    }
    console.log(window.ethereum.chainId);
  };
  async function create() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const userAlice = await PushAPI.initialize(signer, {
      env: CONSTANTS.ENV.STAGING,
    });
    const abi = abi2.result;
    const contractRead = new ethers.Contract(
      "0x37c779a1564DCc0e3914aB130e0e787d93e21804",
      abi,
      provider
    );
    const contract = contractRead.connect(signer);
    console.log(contract);
    const amount = ethers.utils.parseEther("100");
    const tx = await contract.mint(amount);
    await tx.wait();

    const response = await userAlice.channel.create({
      name: "Parental Test Channel",
      description: "Your local channel to communicates among you",
      icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAz0lEQVR4AcXBsU0EQQyG0e+saWJ7oACiKYDMEZVs6GgSpC2BIhzRwAS0sgk9HKn3gpFOAv3v3V4/3+4U4Z1q5KTy42Ql940qvFONnFSGmCFmiN2+fj7uCBlihpgh1ngwcvKfwjuVIWaIGWKNB+GdauSk8uNkJfeNKryzYogZYoZY40m5b/wlQ8wQM8TayMlKeKcaOVkJ71QjJyuGmCFmiDUe+HFy4VyEd57hx0mV+0ZliBlihlgL71w4FyMnVXhnZeSkiu93qheuDDFDzBD7BcCyMAOfy204AAAAAElFTkSuQmCC",
      url: "https://parental-control07.netlify.app/",
    });
    window.ethereum.removeListener("chainChanged", create);
    window.ethereum.on("chainChanged", create2);
    const selectedValue = 1442;
    await provider.send("wallet_switchEthereumChain", [
      { chainId: `0x${Number(selectedValue).toString(16)}` },
    ]);
    // const addedDelegate = await userAlice.channel.delegate.add(
    //   `eip155:11155111:${pushChannelAddress}`,
    // );
    // Subscribe to push channel
    // await userAlice.notification.subscribe(
    //   `eip155:11155111:${pushChannelAddress}`, // channel address in CAIP format
    // );
  }
  const create2 = async () => {
    window.ethereum.removeListener("chainChanged", create2);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractRead2 = new ethers.Contract(
      "0x384cc0998C42FAb018Bf622171902261A7633937",
      contractABI,
      provider
    );
    const contract2 = contractRead2.connect(signer);
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

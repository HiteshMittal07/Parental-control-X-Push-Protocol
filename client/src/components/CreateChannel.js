import { ethers } from "ethers";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import abi2 from "../contractJson/push.json";
import React from "react";

export default function CreateChannel() {
  async function create() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("wallet_switchEthereumChain", [
      { chainId: "0xAA36A7" },
    ]);
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
    // const addedDelegate = await userAlice.channel.delegate.add(
    //   `eip155:11155111:${pushChannelAddress}`,
    // );
    // Subscribe to push channel
    // await userAlice.notification.subscribe(
    //   `eip155:11155111:${pushChannelAddress}`, // channel address in CAIP format
    // );
  }

  return (
    <div className="mt-5 justify-content-center align-content-center align-items-center">
      <h1 className="text-light">Create Channel for Notifications</h1>
      <button className="btn btn-light" onClick={create}>
        Create
      </button>
    </div>
  );
}

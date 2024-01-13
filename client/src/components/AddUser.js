import React, { useContext, useState } from "react";
import { ParentalContext } from "../ParentalContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import abi from "../contractJson/Parental.json";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
export default function AddUser() {
  const { contractAddress } = useContext(ParentalContext);
  const contractABI = abi.abi;
  async function Adduser() {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    const selectedValue = 1442;
    await provider.send("wallet_switchEthereumChain", [
      { chainId: `0x${Number(selectedValue).toString(16)}` },
    ]);
    let signer = provider.getSigner();
    let contractRead2 = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );
    let contract = contractRead2.connect(signer);
    const address = document.querySelector("#address").value;
    try {
      const tx = await contract.addUser(address);
      await tx.wait();
      await provider.send("wallet_switchEthereumChain", [
        { chainId: "0xAA36A7" },
      ]);
      const userAlice = await PushAPI.initialize(signer, {
        env: CONSTANTS.ENV.STAGING,
      });
      await userAlice.channel.send(
        [`${address}`],
        {
          notification: {
            title: "Hey User",
            body: "You have been successfully added to Wallet!",
          },
        },
        toast.success("send successfully")
      );
    } catch (error) {
      toast.error(error.reason);
    }
    toast.success("User added Successfully");
  }

  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <div>
      <button className="btn btn-light ms-2" onClick={openModal}>
        Add User
      </button>
      {showModal && (
        <>
          <div
            className="modal-backdrop"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(5px)",
            }}
            onClick={closeModal}
          ></div>

          {/* Modal */}
          <div
            className="modal"
            tabIndex="-1"
            style={{
              display: "block",
              zIndex: 1050,
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-dark">Add User</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  ></button>
                </div>
                <div className="modal-body">
                  {/* Input fields for the modal */}
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Enter User address"
                    id="address"
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" onClick={Adduser}>
                    Add
                  </button>
                  <button className="btn btn-secondary" onClick={closeModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

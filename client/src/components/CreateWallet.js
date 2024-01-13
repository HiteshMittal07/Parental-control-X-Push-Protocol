import React, { useContext, useState } from "react";
import { ParentalContext } from "../ParentalContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import "bootstrap/dist/css/bootstrap.css";
import { useNavigate } from "react-router-dom";
import { LoadingContext } from "./LoadingContext";
export default function CreateWallet() {
  const { state, setContractAddress, SetCreated, connected } =
    useContext(ParentalContext);
  const { loading, setLoading } = useContext(LoadingContext);
  const navigate = useNavigate();
  async function Create() {
    const { contract, contractRead } = state;
    console.log(contract);
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    const selectedValue = 1442;
    await provider.send("wallet_switchEthereumChain", [
      { chainId: `0x${Number(selectedValue).toString(16)}` },
    ]);
    contractRead.on("created", (contractAddress, event) => {
      console.log(`Created at ${contractAddress}`);
      toast.success("Your Parental Wallet is Created");
      setShowModal(false);
      setContractAddress(contractAddress);
      SetCreated(true);
      setLoading(false);
      navigate("/home");
      event.removeListener();
    });
    try {
      const address = document.querySelector("#address").value;
      setLoading(true);
      const tx = await contract.CreateParentalWallet(address);
      await tx.wait();
    } catch (error) {
      toast.error(error.reason);
    }
  }
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    if (!connected) {
      toast.error("First connect the wallet");
      return;
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <div>
      <button className="btn btn-light" onClick={openModal}>
        Create Wallet
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
                  <h5 className="modal-title">Create the Game</h5>
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
                    placeholder="Enter other owner address"
                    id="address"
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" onClick={Create}>
                    Create
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

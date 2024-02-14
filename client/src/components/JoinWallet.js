import React, { useContext, useState } from "react";
import { ParentalContext } from "../ParentalContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import abi from "../contractJson/Parental.json";
import abi2 from "../contractJson/CreateWallet.json";
import { useNavigate } from "react-router-dom";
import { LoadingContext } from "./LoadingContext";
export default function JoinWallet(props) {
  const { state, setContractAddress, SetJoined, connected, setOwner } =
    useContext(ParentalContext);
  const { loading, setLoading } = useContext(LoadingContext);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const switchChain = async () => {
    window.ethereum.on("chainChanged", join);

    let provider = new ethers.providers.Web3Provider(window.ethereum);
    const selectedValue = 1442;
    // Send the chain switch request
    provider.send("wallet_switchEthereumChain", [
      { chainId: `0x${Number(selectedValue).toString(16)}` },
    ]);
    if (window.ethereum.chainId == `0x${Number(selectedValue).toString(16)}`) {
      await join();
    }
    console.log(window.ethereum.chainId);
  };
  async function join() {
    const contractABI = abi.abi;
    const contractAbi = abi2.abi;
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = provider.getSigner();
    const add = document.querySelector("#addr").value;
    setShowModal(false);
    setLoading(true);
    let contractRead = new ethers.Contract(
      "0x384cc0998C42FAb018Bf622171902261A7633937",
      contractAbi,
      provider
    );
    try {
      // contractRead.on("joined", (contractAddress, event) => {
      //   window.ethereum.removeListener("chainChanged", join);
      //   setContractAddress(contractAddress);
      //   toast.success("Joined Successfully");
      //   SetJoined(true);
      //   setLoading(false);
      //   setOwner(add);
      //   navigate("/home");
      //   event.removeListener();
      // });
      const contract = contractRead.connect(signer);
      const tx = await contract.joinWallet(add);
      console.log(tx);
      // await tx.wait();
      window.ethereum.removeListener("chainChanged", join);
      setContractAddress(tx);
      toast.success("Joined Successfully");
      SetJoined(true);
      setLoading(false);
      setOwner(add);
      navigate("/home");
    } catch (error) {
      setLoading(false);
      toast.error(error.reason);
    }
  }
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
      <div>
        <button className="btn btn-light" onClick={openModal}>
          Join Wallet
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
                      placeholder="Enter owner address"
                      id="addr"
                    />
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-primary" onClick={switchChain}>
                      Join
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
    </div>
  );
}

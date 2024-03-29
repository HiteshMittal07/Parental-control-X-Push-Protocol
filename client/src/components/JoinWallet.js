import React, { useContext, useState } from "react";
import { ParentalContext } from "../ParentalContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import abi from "../contractJson/Parental.json";
import abi2 from "../contractJson/CreateWallet.json";
import { useNavigate } from "react-router-dom";
import "./initial.css";
import { LoadingContext } from "./LoadingContext";
export default function JoinWallet(props) {
  const { state, setContractAddress, SetJoined, setOwner, connected } =
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
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
      params: [],
    });
    if (chainId == `0x${Number(selectedValue).toString(16)}`) {
      await join();
    }
    console.log(chainId);
  };
  async function join() {
    const contractABI = abi.abi;
    const contractAbi = abi2.abi;
    const add = document.querySelector("#addr").value;
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = provider.getSigner();
    setShowModal(false);
    setLoading(true);
    let contractRead = new ethers.Contract(
      "0xb65f926c6c420671892561334C289485faC9309E",
      contractAbi,
      provider
    );
    try {
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
      localStorage.setItem("enter", "true");
      localStorage.setItem("owner", add);
      localStorage.setItem("contractAddr", tx);
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
        <button
          className="btn btn-outline-secondary custom-btn"
          onClick={openModal}
        >
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
                    <h5 className="modal-title">Join Wallet</h5>
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

import React, { useContext, useState } from "react";
import { ParentalContext } from "../useContext/ParentalContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "../Styles/initial.css";
import { LoadingContext } from "../useContext/LoadingContext";
import {
  getAddress,
  getChainId,
  getContractRead,
  getWeb3Provider,
  switchNetwork,
} from "../Web3/web3";
export default function JoinWallet(props) {
  const { connected } = useContext(ParentalContext);
  const { loading, setLoading } = useContext(LoadingContext);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const switchChain = async () => {
    window.ethereum.on("chainChanged", join);
    const selectedValue = "534351";
    await switchNetwork(selectedValue);
    const chainId = await getChainId();
    if (chainId == `0x${Number(selectedValue).toString(16)}`) {
      await join();
    }
    console.log(chainId);
  };
  async function join() {
    const add = document.querySelector("#addr").value;
    if (!add) {
      toast.error("enter valid address");
      return;
    }
    const contractAddress = getAddress("534351");
    let provider = getWeb3Provider();
    let signer = provider.getSigner();
    setShowModal(false);
    setLoading(true);
    let contractRead = getContractRead(provider, contractAddress);
    try {
      const contract = contractRead.connect(signer);
      const tx = await contract.joinWallet(add);
      window.ethereum.removeListener("chainChanged", join);
      toast.success("Joined Successfully");
      setLoading(false);
      localStorage.setItem("enter", true);
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

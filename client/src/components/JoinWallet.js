<<<<<<< HEAD
import React, { useContext } from "react";
=======
import React, { useContext, useState } from "react";
>>>>>>> 09d64b6 (adding push notifications)
import { ParentalContext } from "../ParentalContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import abi from "../contractJson/Parental.json";
<<<<<<< HEAD
export default function JoinWallet() {
  const { state, setContractAddress, setState2, SetJoined } =
    useContext(ParentalContext);
  async function join() {
    const { contractRead, contract } = state;
    // console.log(contractRead);
    const contractABI = abi.abi;
=======
import abi2 from "../contractJson/CreateWallet.json";
import { useNavigate } from "react-router-dom";
import { LoadingContext } from "./LoadingContext";
export default function JoinWallet(props) {
  const { state, setContractAddress, SetJoined, connected } =
    useContext(ParentalContext);
  const { loading, setLoading } = useContext(LoadingContext);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  async function join() {
    const contractABI = abi.abi;
    const contractAbi = abi2.abi;
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    const selectedValue = 1442;
    await provider.send("wallet_switchEthereumChain", [
      { chainId: `0x${Number(selectedValue).toString(16)}` },
    ]);
    let signer = provider.getSigner();
    const add = document.querySelector("#addr").value;
    setShowModal(false);
    setLoading(true);
    let contractRead = new ethers.Contract(
      "0x35895eCD2Cf81F0f9ccc5B621d465484149D026D",
      contractAbi,
      provider
    );
>>>>>>> 09d64b6 (adding push notifications)
    try {
      contractRead.on("joined", (contractAddress, event) => {
        setContractAddress(contractAddress);
        toast.success("Joined Successfully");
<<<<<<< HEAD
        let contract2 = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        let contractRead2 = new ethers.Contract(
          contractAddress,
          contractABI,
          provider
        );

        contractRead2.on("", () => {});
        contractRead2.on("", () => {});
        contractRead2.on("", () => {});
        // console.log(contractRead2);
        setState2({ provider, signer, contract2, contractRead2 });
        SetJoined(true);
        event.removeListener();
      });
      let provider = new ethers.BrowserProvider(window.ethereum);
      let signer = await provider.getSigner();
      const add = document.querySelector("#addr").value;
=======
        SetJoined(true);
        setLoading(false);
        navigate("/home");
        event.removeListener();
      });
      const contract = contractRead.connect(signer);
>>>>>>> 09d64b6 (adding push notifications)
      const tx = await contract.joinWallet(add);
      await tx.wait();
    } catch (error) {
      toast.error(error.reason);
    }
  }
<<<<<<< HEAD
  return (
    <div>
      <input type="text" placeholder="enter owner address" id="addr" />
      <button onClick={join}>Join</button>
=======
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
                    <button className="btn btn-primary" onClick={join}>
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
>>>>>>> 09d64b6 (adding push notifications)
    </div>
  );
}

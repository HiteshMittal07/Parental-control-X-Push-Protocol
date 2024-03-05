import { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Axios from "axios";
import { ParentalContext } from "../ParentalContext";
import { ethers } from "ethers";
import abi from "../contractJson/Parental.json";
import BeatLoader from "react-spinners/BeatLoader";
const Owners = () => {
  const contractAddress = localStorage.getItem("contractAddr");
  const contractABI = abi.abi;
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [switched, setSwitched] = useState(false);
  const override = {
    display: "block",
    marginTop: "200px",
  };
  useEffect(() => {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let contractRead2 = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );
    const switchChain = async () => {
      try {
        setLoading(true);
        const selectedValue = 1442;
        await provider.send("wallet_switchEthereumChain", [
          { chainId: `0x${Number(selectedValue).toString(16)}` },
        ]);
        setSwitched(true);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchOwnersDetails = async () => {
      if (switched) {
        const tx = await contractRead2.getOwners();
        const ownersWithDetails = await Promise.all(
          tx.map(async (ownerAddress) => {
            const { data } = await Axios.get("https://randomuser.me/api/");
            const details = data.results[0];
            setLoading(false);
            return { ownerAddress, details };
          })
        );
        setOwners(ownersWithDetails);
      }
    };
    switchChain();
    fetchOwnersDetails();
  }, [switched]);

  return (
    <div>
      {loading ? (
        <>
          <BeatLoader color="#ffffff" cssOverride={override} />
          <p className="text-light">Fetching Owners...</p>
        </>
      ) : (
        <div className="container mt-4">
          <h2 className="text-uppercase mb-3 text-light">Owners</h2>
          <div className="row">
            {owners.map(({ ownerAddress, details }) => (
              <div className="col-md-6 mb-4" key={ownerAddress}>
                <div className="card">
                  <img
                    src={details.picture?.large} // Use larger images
                    className="card-img-top img-fluid rounded"
                    alt="Owner"
                    style={{ objectFit: "cover", height: "400px" }} // Adjust height
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {details.name?.first} {details.name?.last}
                    </h5>
                    <p className="card-text">
                      <span className="fw-bold text-primary">Address:</span>{" "}
                      {ownerAddress}
                    </p>
                    <a href="#" className="btn btn-primary">
                      Know More
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Owners;

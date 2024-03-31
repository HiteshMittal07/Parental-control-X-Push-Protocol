import { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Axios from "axios";
import BeatLoader from "react-spinners/BeatLoader";
import {
  getParentalContractRead,
  getWeb3Provider,
  switchNetwork,
} from "../Web3/web3";
const Owners = () => {
  const contractAddress = localStorage.getItem("contractAddr");
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [switched, setSwitched] = useState(false);
  const override = {
    display: "block",
    marginTop: "200px",
  };
  useEffect(() => {
    let provider = getWeb3Provider();
    let contractRead = getParentalContractRead(provider, contractAddress);
    const switchChain = async () => {
      try {
        setLoading(true);
        const selectedValue = 1442;
        await switchNetwork(selectedValue);
        setSwitched(true);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchOwnersDetails = async () => {
      if (switched) {
        const tx = await contractRead.getParents();
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
          <p className="text-light">Fetching Parents...</p>
        </>
      ) : (
        <div className="container mt-4">
          <h2 className="text-uppercase mb-3 text-light">Parents</h2>
          <div className="row">
            {owners.map(({ ownerAddress, details }) => (
              <div className="col-md-6 mb-4" key={ownerAddress}>
                <div
                  className="card"
                  style={{ width: "28rem", borderRadius: "15px" }}
                >
                  <img
                    src={details.picture?.large} // Use larger images
                    className="card-img-top img-fluid rounded"
                    alt="Owner"
                    style={{ objectFit: "cover", height: "350px" }} // Adjust height
                  />
                  <div className="card-body ">
                    <h5 className="card-title text-white">
                      {details.name?.first} {details.name?.last}
                    </h5>
                    <p className="card-text">
                      <span className="fw-bold text-primary">Address:</span>{" "}
                      <span className="text-white">{ownerAddress}</span>
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

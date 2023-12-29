import React, { useContext } from "react";
import { ParentalContext } from "../ParentalContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function AddUser() {
  const { state2 } = useContext(ParentalContext);
  async function Adduser() {
    const { contract2 } = state2;
    const address = document.querySelector("#address").value;
    try {
      const tx = await contract2.addUser(address);
      await tx.wait();
    } catch (error) {
      toast.error(error.reason);
    }
    toast.success("User added Successfully");
  }
  return (
    <div>
      <h1 className="text-center mt-5">Add User</h1>
      <form
        onSubmit={Adduser}
        className="d-flex flex-column align-items-center"
      >
        <input
          type="text"
          id="address"
          placeholder="Enter user's wallet address"
        />
        <br />
        <button onClick={Adduser} className="btn btn-primary col-4 mt-3">
          Add User
        </button>
      </form>
    </div>
  );
}

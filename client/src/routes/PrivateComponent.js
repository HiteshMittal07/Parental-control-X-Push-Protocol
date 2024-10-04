import { Navigate } from "react-router-dom";

const PrivateRoute = ({ Component }) => {
  return localStorage.getItem("enter") ? <Component /> : <Navigate to="/" />;
};
export default PrivateRoute;

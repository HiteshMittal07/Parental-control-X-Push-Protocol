import { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Header from "./components/Header";
import Router from "./routes/Router";
import "./App.css";
import { ParentalContext } from "./useContext/ParentalContext";
function App() {
  const [connected, setConnected] = useState(false);
  return (
    <ParentalContext.Provider
      value={{
        connected,
        setConnected,
      }}
    >
      <div className="App">
        <Header />
        <Router />
      </div>
    </ParentalContext.Provider>
  );
}

export default App;

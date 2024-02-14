import React, { useEffect, useState } from "react";
import { NotificationItem } from "@pushprotocol/uiweb";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { ethers } from "ethers";
import BeatLoader from "react-spinners/BeatLoader";
import { toast } from "react-toastify";
const NotificationInterface = () => {
  const [loading, setLoading] = useState(false);
  const inputStyle = {
    padding: "10px",
    margin: "10px 0",
    width: "100%",
    boxSizing: "border-box",
  };

  const override = {
    display: "block",
    marginTop: "200px",
  };
  const textareaStyle = {
    ...inputStyle,
    height: "100px",
    resize: "vertical",
  };

  const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: "#dd44b9",
    color: "#FFF",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
  };

  const [wallet, setWallet] = useState("");
  const [notifItems, setNotifItems] = useState([]);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        setLoading(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        // Switch to sepolia
        await provider.send("wallet_switchEthereumChain", [
          { chainId: "0xAA36A7" },
        ]);
        // Get provider
        // await provider.send("eth_requestAccounts", []);

        // Grabbing signer from provider
        const signer = provider.getSigner();

        // Initialize user for push
        const userAlice = await PushAPI.initialize(signer, {
          env: CONSTANTS.ENV.STAGING,
        });

        const address = await signer.getAddress();
        setWallet(address);
        // console.log(address);
        // retrieve notifications for users
        const inboxNotifications = await userAlice.notification.list("INBOX", {
          account: `eip155:11155111:${address}`,
          limit: 5,
        });

        // set notifItems state so that react can render
        setNotifItems(inboxNotifications);
        setLoading(false);
      } catch (error) {
        console.log("Error getting notification", error);
      }
      // Demo only supports MetaMask (or other browser based wallets) and gets provider that injects as window.ethereum into each page
    };
    fetchNotification();
  }, []);

  return (
    <div>
      {loading ? (
        <>
          <BeatLoader color="#ffffff" cssOverride={override} />
          <p className="text-light">Loading Notifications...</p>
        </>
      ) : (
        <div style={{ width: "50%", margin: "20px auto" }}>
          {notifItems.length > 0 ? (
            <h3 className="text-light">{`Notification Items for ${wallet}`}</h3>
          ) : (
            <></>
          )}

          {notifItems.map((notifItemSingular, idx) => {
            const {
              cta,
              title,
              message,
              app,
              icon,
              image,
              url,
              blockchain,
              notification,
            } = notifItemSingular;

            return (
              <NotificationItem
                key={idx} // any unique id
                notificationTitle={title}
                notificationBody={message}
                cta={cta}
                app={app}
                icon={icon}
                image={image}
                url={url}
                theme={"dark"} // or can be dark
                chainName={blockchain}
                // chainName={blockchain as chainNameType} // if using Typescript
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
export default NotificationInterface;

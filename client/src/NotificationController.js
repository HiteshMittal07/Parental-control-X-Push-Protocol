import React, { useState } from "react";
import NotificationInterface from "./NotificationInterface";
import SpamInterface from "./SpamInterface";

export default function NotificationController() {
  const [selected, setSelected] = useState(true);
  return (
    <div className="overflow-hidden">
      <div className="row justify-content-center align-content-center">
        <div className="col-1">
          <button onClick={() => setSelected(true)} className="btn btn-light">
            Inbox
          </button>
        </div>
        <div className="col-1">
          <button onClick={() => setSelected(false)} className="btn btn-light">
            Spam
          </button>
        </div>
      </div>
      {selected ? (
        <div>
          <NotificationInterface />{" "}
        </div>
      ) : (
        <SpamInterface />
      )}
    </div>
  );
}

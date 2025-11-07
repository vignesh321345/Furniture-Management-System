import { useState } from "react";
import Ordered from "./Ordered/Ordered";
import Sell from "./Sell/Sell";
import "./History.css"; // style as needed

function History() {
  const [status, setStatus] = useState(false);

  return (
    <div className="orders_container">
      <h1>Your Orders</h1>
      <div className="sections">
        {status ? (
          <div className="saled">
            <Sell />
          </div>
        ) : (
          <div className="purchased">
            <Ordered />
          </div>
        )}
        <div className="btns">
          <div className="purchasedbtn">
            <button onClick={() => setStatus(false)}>Purchase</button>
          </div>
          <div className="sellbtn">
            <button onClick={() => setStatus(true)}>Sell</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;

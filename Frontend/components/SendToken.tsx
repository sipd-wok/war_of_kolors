import { useState } from "react";
import { useWallet } from "../context/WalletContext";

const SendTokens: React.FC = () => {
  const { shopPayment } = useWallet();
  const [amount, setAmount] = useState("");

  return (
    <div>
      {/* <input
        type="text"
        placeholder="Recipient Address"
        onChange={(e) => setRecipient(e.target.value)}
      /> */}
      <input
        type="text"
        placeholder="Amount"
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={() => shopPayment(amount)}>Send Tokens</button>
    </div>
  );
};

export default SendTokens;

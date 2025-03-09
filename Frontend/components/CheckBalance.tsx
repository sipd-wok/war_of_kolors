import { useWallet } from "../context/WalletContext";
import SendTokens from "./SendToken";

const CheckBalance: React.FC = () => {
  const { walletAddress, balance } = useWallet();

  return (
    <div className="w-full  flex items-center flex-col">
      <p>Wallet: {walletAddress || "Not connected"}</p>
      <p>Your Balance: {balance} WOK</p>
      <SendTokens />
    </div>
  );
};

export default CheckBalance;

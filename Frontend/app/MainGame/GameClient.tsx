"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import type { IRefPhaserGame } from "../_game/PhaserGame";
import { WalletProvider } from "@/context/WalletContext";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

// Dynamically import PhaserGame with SSR disabled
const PhaserGame = dynamic(
  () => import("../_game/PhaserGame").then((mod) => mod.PhaserGame),
  { ssr: false },
);

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function GameClient() {
  const phaserRef = useRef<IRefPhaserGame | null>(null);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    // Add event listener for the custom Phaser event
    const handleOpenModal = (event: Event) => {
      console.log("Modal open event received", event);
      setOpen(true);
    };

    // Listen for both custom event and direct EventBus communication
    window.addEventListener("open-modal", handleOpenModal);

    // Debug message to confirm the listener is set up
    console.log("Modal event listener registered");

    // Cleanup
    return () => {
      window.removeEventListener("open-modal", handleOpenModal);
    };
  }, []);

  return (
    <WalletProvider>
      <div id="app" className="relative">
        <div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Text in a modal
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
              </Typography>
            </Box>
          </Modal>
        </div>
        <PhaserGame ref={phaserRef} />
      </div>
    </WalletProvider>
  );
}

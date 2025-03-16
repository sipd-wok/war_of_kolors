import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from "react";
import StartGame from "./main";
import { EventBus } from "./EventBus";
import { useWallet } from "@/context/WalletContext";

export interface IRefPhaserGame {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

interface IProps {
  currentActiveScene?: (scene_instance: Phaser.Scene) => void;
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(
  function PhaserGame({ currentActiveScene }, ref) {
    const game = useRef<Phaser.Game | null>(null!);
    const { shopPayment, buyAndmint, walletAddress, balance } = useWallet();

    // Create wrapper that returns void to match the expected type
    const buyAndmintWrapper = useCallback(
      async (
        amount: string,
        walletAddress: string,
        metadataURI: string,
      ): Promise<void> => {
        await buyAndmint(amount, walletAddress, metadataURI);
        // Void return, discarding the message
      },
      [buyAndmint],
    );

    useLayoutEffect(() => {
      if (game.current === null) {
        try {
          // Make sure all params are defined before passing to StartGame
          const containerId = "game-container";

          game.current = StartGame(
            containerId,
            shopPayment || null,
            buyAndmintWrapper,
            walletAddress || "",
            balance || "0",
          );

          // Update ref only once
          if (typeof ref === "function") {
            ref({ game: game.current, scene: null });
          } else if (ref) {
            ref.current = { game: game.current, scene: null };
          }
        } catch (error) {
          console.error("Error starting game:", error);
        }
      }

      return () => {
        if (game.current) {
          game.current.destroy(true);
          if (game.current !== null) {
            game.current = null;
          }
        }
      };
    }, [ref, shopPayment, buyAndmintWrapper, walletAddress, balance]);

    useEffect(() => {
      EventBus.on("current-scene-ready", (scene_instance: Phaser.Scene) => {
        if (currentActiveScene && typeof currentActiveScene === "function") {
          currentActiveScene(scene_instance);
        }

        if (typeof ref === "function") {
          ref({ game: game.current, scene: scene_instance });
        } else if (ref) {
          ref.current = { game: game.current, scene: scene_instance };
        }
      });
      return () => {
        EventBus.removeListener("current-scene-ready");
      };
    }, [currentActiveScene, ref]);

    return (
      <>
        <div id="game-container"></div>
      </>
    );
  },
);

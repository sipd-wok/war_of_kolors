"use client";

import {
  ArrowLeft,
  Tag,
  Info,
  Send,
  HelpCircle,
  Sword,
  Award,
  Gamepad2,
  Star,
  TrendingUp,
  Check,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { WOKCharacter } from "./MarketplaceComponent";

interface CharacterDetailsComponentProps {
  onClose?: () => void;
  character: WOKCharacter | null;
  refreshData?: () => Promise<void>;
}

const CharacterDetailsComponent = ({
  onClose,
  character,
  refreshData,
}: CharacterDetailsComponentProps) => {
  const [price, setPrice] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | "none";
    message: string;
  }>({ type: "none", message: "" });

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
    // Reset status message when user changes input
    if (status.type !== "none") {
      setStatus({ type: "none", message: "" });
    }
  };

  const handleListForSale = async () => {
    // Input validation
    if (!character) {
      setStatus({
        type: "error",
        message: "Character data missing",
      });
      return;
    }

    if (!price || price.trim() === "") {
      setStatus({
        type: "error",
        message: "Please enter a price",
      });
      return;
    }

    const priceValue = Number(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      setStatus({
        type: "error",
        message: "Please enter a valid positive number for price",
      });
      return;
    }

    setIsLoading(true);
    setStatus({ type: "none", message: "" });

    try {
      const response = await fetch("/api/marketplace/sellCharacter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          character_id: character.id,
          price: priceValue,
          currency: "WoK",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: "Character successfully listed for sale!",
        });

        // Refresh data after successful listing
        if (refreshData) {
          await refreshData();
        }

        // Close the modal after successful listing with a slight delay
        setTimeout(() => {
          if (onClose) {
            onClose();
          }
        }, 1500);
      } else {
        setStatus({
          type: "error",
          message: data.error || "Failed to list character for sale",
        });
      }
    } catch (error) {
      console.error("Error listing character for sale:", error);
      setStatus({
        type: "error",
        message: "Network error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header with back button */}
        <div className="mb-8">
          <button
            onClick={onClose}
            className="inline-flex items-center text-purple-600 mb-6 hover:text-purple-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to Marketplace</span>
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                List {character?.name || "Character"} For Sale
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Set a price to sell your character in our marketplace
              </p>
            </div>
          </div>
        </div>

        {/* Form with enhanced UI */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          {/* Character Preview Panel */}
          <div className="mb-8 border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Character Details
            </h3>
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Character Image/Color */}
              <div className="w-full sm:w-1/3 aspect-square relative rounded-lg overflow-hidden">
                <div
                  className={`w-full h-full ${getColorClass(
                    character?.color || "",
                  )} flex items-center justify-center text-white font-bold`}
                >
                  <div className="text-4xl opacity-30">
                    {character?.name?.charAt(0) || "?"}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sword className="h-12 w-12 text-white opacity-30" />
                  </div>
                  {character?.sprite && (
                    <div
                      className="aspect-square bg-cover bg-center absolute inset-0 w-full"
                      style={{
                        backgroundImage: `url(/assets/${character.sprite})`,
                      }}
                    ></div>
                  )}
                </div>
              </div>

              {/* Character Stats */}
              <div className="w-full sm:w-2/3">
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {character?.name || "Unknown Character"}
                  </h4>
                  <span
                    className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-semibold ${getTierBadgeClass(
                      character?.tier || "",
                    )}`}
                  >
                    {character?.tier || "Unknown"} Tier
                  </span>
                </div>

                {/* Character Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    Luck: {character?.luck || 0}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Gamepad2 className="h-4 w-4 mr-1 text-blue-500" />
                    Played: {character?.games_played || 0}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Award className="h-4 w-4 mr-1 text-green-500" />
                    Wins: {character?.games_won || 0}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <TrendingUp className="h-4 w-4 mr-1 text-purple-500" />
                    {character?.games_played && character.games_played > 0
                      ? Math.round(
                          (character.games_won / character.games_played) * 100,
                        )
                      : 0}
                    % Win Rate
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Price Setting Section */}
          <div className="space-y-6">
            {/* Status Message */}
            {status.type !== "none" && (
              <div
                className={`p-4 border rounded-md flex items-start ${
                  status.type === "success"
                    ? "bg-green-50 border-green-400 dark:bg-green-900/30 dark:border-green-700"
                    : "bg-red-50 border-red-400 dark:bg-red-900/30 dark:border-red-700"
                }`}
              >
                {status.type === "success" ? (
                  <Check className="h-5 w-5 mr-2 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 mr-2 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <span
                  className={`${
                    status.type === "success"
                      ? "text-green-700 dark:text-green-300"
                      : "text-red-700 dark:text-red-300"
                  }`}
                >
                  {status.message}
                </span>
              </div>
            )}

            {/* Pricing - Enhanced with tooltip */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                >
                  <Tag className="h-4 w-4 mr-2" />
                  Set Your Price
                </label>
                <div className="relative group">
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <Info className="h-3 w-3 mr-1" />
                    Platform fee: 2.5%
                  </span>
                  <div className="absolute right-0 bottom-full mb-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg p-2 text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hidden group-hover:block z-10">
                    Platform fees help maintain the marketplace and are
                    calculated based on the final sale price.
                    <div className="absolute h-2 w-2 bg-white dark:bg-gray-800 transform rotate-45 -bottom-1 right-6 border-r border-b border-gray-200 dark:border-gray-700"></div>
                  </div>
                </div>
              </div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="price"
                  id="price"
                  value={price}
                  onChange={handlePriceChange}
                  disabled={isLoading}
                  className={`block w-full rounded-md border ${
                    status.type === "error"
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500"
                  } pl-3 pr-12 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                  placeholder="0.00"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">WoK</span>
                </div>
              </div>
              {/* Price recommendation */}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <HelpCircle className="h-3 w-3 mr-1" />
                Enter a whole number value for the price in WoK tokens
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-5">
              <button
                type="button"
                onClick={handleListForSale}
                disabled={isLoading}
                className={`w-full sm:w-auto px-6 py-3 ${
                  isLoading
                    ? "bg-purple-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                } text-white font-medium rounded-lg transition-colors flex items-center justify-center`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    List for Sale
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
              >
                Cancel
              </button>
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
              By listing this character, you agree to our Terms of Service and
              confirm this character doesn&apos;t violate our Community
              Guidelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
function getColorClass(color: string) {
  switch (color.toLowerCase()) {
    case "red":
      return "bg-gradient-to-br from-red-400 to-red-800";
    case "yellow":
      return "bg-gradient-to-br from-yellow-400 to-amber-800";
    case "blue":
      return "bg-gradient-to-br from-blue-400 to-indigo-800";
    case "green":
      return "bg-gradient-to-br from-green-400 to-emerald-800";
    case "purple":
      return "bg-gradient-to-br from-purple-400 to-indigo-800";
    case "pink":
      return "bg-gradient-to-br from-pink-400 to-rose-800";
    case "white":
      return "bg-gradient-to-br from-gray-100 to-gray-500";
    case "rainbow":
      return "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500";
    default:
      return "bg-gradient-to-br from-gray-400 to-gray-800";
  }
}

function getTierBadgeClass(tier: string) {
  const lowerCaseTier = tier.toLowerCase();
  switch (lowerCaseTier) {
    case "bronze":
      return "bg-yellow-500 text-yellow-900";
    case "silver":
      return "bg-gray-500 text-gray-900 text-white";
    case "gold":
      return "bg-yellow-300 text-yellow-800";
    case "rainbow":
      return "bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 text-white";
    default:
      return "bg-gray-500 text-gray-900";
  }
}

export default CharacterDetailsComponent;

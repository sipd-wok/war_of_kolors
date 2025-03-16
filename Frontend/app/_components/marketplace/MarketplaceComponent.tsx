"use client";

import Modal from "@mui/material/Modal";
import React, { useState, useEffect } from "react";
import CharacterDetailsComponent from "./CharacterDetailsComponent";
import {
  ShoppingBag,
  Filter,
  ChevronDown,
  Zap,
  Eye,
  Heart,
  ArrowRight,
  Menu,
  Sword,
  Award,
  Star,
  Bookmark,
  Gamepad2,
  TrendingUp,
  User,
  Shield,
} from "lucide-react";
import { useWallet } from "@/context/WalletContext";

export class WOKCharacter {
  id!: string;
  owner_id!: string;
  owner_username?: string;
  color!: string;
  luck!: number;
  sprite!: string;
  name!: string;
  tier!: string;
  on_sale!: boolean;
  price!: number;
  currency!: string;
  games_played!: number;
  games_won!: number;
  image!: string;
  token_id!: string;
  owner_wallet!: string;
  atk!: number;
  def!: number;
  hp!: number;

  constructor() {
    this.id = "";
    this.owner_id = "";
    this.owner_username = "";
    this.color = "";
    this.luck = 0;
    this.sprite = "";
    this.name = "";
    this.tier = "";
    this.on_sale = false;
    this.price = 0;
    this.currency = "";
    this.games_played = 0;
    this.games_won = 0;
    this.image = "";
    this.token_id = "";
    this.owner_wallet = "";
    this.atk = 0;
    this.def = 0;
    this.hp = 0;
  }
}

interface User {
  id: string;
  user_id: string;
  username: string;
}

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
      return "bg-gray-500 text-gray-900  text-white";
    case "gold":
      return "bg-yellow-300 text-yellow-800";
    case "rainbow":
      return "bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 text-white";
    default:
      return "bg-gray-500 text-gray-900";
  }
}

const MarketplaceComponent = () => {
  const [userInfo, setUserInfo] = useState<User>();
  const [nfts, setNfts] = useState<WOKCharacter[]>([]);
  const [ownedCharacters, setOwnedCharacters] = useState<WOKCharacter[]>([]);
  const [selectedCharacter, setSelectedCharacter] =
    useState<WOKCharacter | null>(null);
  const { transferNFT } = useWallet();
  const [characterModalIsOpen, setCharacterModalOpen] = useState(false);
  const handleCharacterModalOpen = (character: WOKCharacter) => {
    setSelectedCharacter(character);
    setCharacterModalOpen(true);
  };
  const handleCharacterModalClose = () => setCharacterModalOpen(false);

  // Function to refresh data after listing a character
  const refreshData = async () => {
    await Promise.all([fetchOwnedCharacters(), fetchNFTs()]);
  };

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/getUser");
        if (response.ok) {
          const data = await response.json();
          setUserInfo(data.user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
    fetchOwnedCharacters();
    fetchNFTs();
  }, []);

  // Extract fetch functions outside useEffect for reuse
  const fetchOwnedCharacters = async () => {
    try {
      const response = await fetch("/api/getCharacters");
      if (response.ok) {
        const data = await response.json();

        // Create mapped characters array
        const mappedCharacters: WOKCharacter[] = [];

        // Process each character from the API
        for (const char of data.characters) {
          // Create a new character instance
          const character = new WOKCharacter();

          // Map base properties
          character.id = char.id;
          character.owner_id = char.owner_id || "";
          character.color = char.color || "";
          character.luck = char.luck || 0;
          character.sprite = char.sprite || "";
          character.name = char.name || "";
          character.tier = char.tier || "";
          character.on_sale = char.on_sale || false;
          character.games_played = char.games_played || 0;
          character.games_won = char.games_won || 0;
          character.image = char.image || "";
          character.token_id = char.token_id || "";
          character.owner_wallet = char.owner_wallet || "";
          character.atk = char.atk;
          character.def = char.def;
          character.hp = char.hp;

          // For characters that are on sale, fetch the price and currency
          if (char.on_sale) {
            try {
              const saleResponse = await fetch(
                "/api/marketplace/getForSaleByID",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    character_id: char.id,
                  }),
                },
              );

              if (saleResponse.ok) {
                const saleData = await saleResponse.json();
                if (saleData.saleDetails && saleData.saleDetails.length > 0) {
                  character.price = saleData.saleDetails[0].price || 0;
                  character.currency = saleData.saleDetails[0].currency || "";
                }
              } else {
                console.error(
                  "Failed to get sale details for character:",
                  char.id,
                );
              }
            } catch (error) {
              console.error("Error fetching sale details:", error);
            }
          }

          // Add the character to our mapped array
          mappedCharacters.push(character);
        }

        // Update state with the mapped characters
        setOwnedCharacters(mappedCharacters);
      }
    } catch (error) {
      console.error("Error fetching owned characters:", error);
    }
  };

  const fetchNFTs = async () => {
    try {
      const response = await fetch("/api/marketplace/getAllForSale");
      if (response.ok) {
        const data = await response.json();

        if (!data) {
          console.error("No NFTs found");
          return;
        }

        setNfts(data.characters);
        console.log(data);
      }
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  };
  const [showReceipt, setReceipt] = useState(false);
  let tokenId = "";
  const buyNft = async (owner: string, user: string, token: string) => {
    //  await transferNFT(nft.owner_wallet,userInfo.user_id,nft.token_id)
    console.log(owner, user, token);
    try {
      await transferNFT(owner.toString(), user.toString(), token.toString());
      tokenId = token;
      setReceipt(true);
    } catch (error) {
      alert("Transaction failed");
      console.error(error);
    }
  };
  return (
    // Add h-screen and overflow-auto to enable scrolling
    <div className="w-full h-screen overflow-auto bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <Modal
        open={characterModalIsOpen}
        onClose={handleCharacterModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="flex items-center justify-center"
      >
        <div className="max-w-5xl overflow-y-scroll h-[95%] bg-white dark:bg-gray-800 rounded-xl mx-auto">
          <CharacterDetailsComponent
            onClose={handleCharacterModalClose}
            character={selectedCharacter}
            refreshData={refreshData}
          />
        </div>
      </Modal>

      <div className="max-w-7xl mx-auto">
        {/* Marketplace Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center">
            <ShoppingBag className="h-8 w-8 text-purple-600 mr-3 hidden sm:block" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                NFT Marketplace
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Discover, collect, and sell extraordinary characters
              </p>
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button className="px-4 py-2 text-purple-600 border-b-2 border-purple-600 font-medium">
            <User className="h-4 w-4 inline mr-2" />
            My Characters
          </button>
          <button className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <ShoppingBag className="h-4 w-4 inline mr-2" />
            Marketplace
          </button>
        </div>

        {/* My Characters Section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <Sword className="h-5 w-5 mr-2 text-purple-600" />
              Characters You Own
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {ownedCharacters.length} Characters
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {ownedCharacters.map((character) => (
              <div
                key={character.id}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-1"
              >
                <div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
                  <div
                    className={`w-full h-full ${getColorClass(character.color)} flex items-center justify-center text-white font-bold relative`}
                  >
                    <div className="text-4xl opacity-30">
                      {character.name.charAt(0)}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sword className="h-12 w-12 text-white opacity-30" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center w-full h-full">
                      <div
                        className="aspect-square bg-cover bg-center w-6/7 p-6"
                        style={{
                          backgroundImage: `url(${character.image || "assets/char_" + character.sprite.replace(/\D/g, "") + ".png"})`,
                        }}
                      ></div>
                    </div>

                    <div className="absolute bottom-5 left-1/2 w-3/5 h-3 bg-black opacity-50 rounded-full blur-lg transform -translate-x-1/2"></div>
                  </div>

                  {/* Tier Badge */}
                  <div className="absolute top-2 right-2">
                    <div
                      className={`${getTierBadgeClass(character.tier)} px-2 py-1 rounded-full text-xs font-semibold flex items-center`}
                    >
                      <Star className="h-3 w-3 mr-1" />
                      {character.tier}
                    </div>
                  </div>

                  {/* Not Listed Badge */}
                  <div className="absolute top-2 left-2">
                    {character.on_sale ? (
                      <div className="bg-green-600 bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <ShoppingBag className="h-3 w-3 mr-1" />
                        Listed
                      </div>
                    ) : (
                      <div className="bg-gray-800 bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <Bookmark className="h-3 w-3 mr-1" />
                        Not
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {character.name}
                  </h3>

                  {/* Character Stats */}
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Star className="h-3 w-3 mr-1 text-yellow-500" />
                      Luck: {character.luck}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Gamepad2 className="h-3 w-3 mr-1 text-blue-500" />
                      Played: {character.games_played}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Award className="h-3 w-3 mr-1 text-green-500" />
                      Wins: {character.games_won}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <TrendingUp className="h-3 w-3 mr-1 text-purple-500" />
                      {character.games_played > 0
                        ? Math.round(
                            (character.games_won / character.games_played) *
                              100,
                          )
                        : 0}
                      % Win Rate
                    </div>
                  </div>

                  {/* Combat Stats */}
                  <div className="grid grid-cols-3 gap-1 mt-2">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Sword className="h-3 w-3 mr-1 text-red-500" />
                      ATK: {character.atk}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Shield className="h-3 w-3 mr-1 text-blue-500" />
                      DEF: {character.def}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Heart className="h-3 w-3 mr-1 text-green-500" />
                      HP: {character.hp}
                    </div>
                  </div>

                  {character.on_sale ? (
                    <button
                      className="mt-3 w-full py-2 bg-gray-400 text-white rounded-lg flex items-center justify-center cursor-not-allowed"
                      disabled
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Listed: {character.price} {character.currency}
                    </button>
                  ) : (
                    <button
                      className="mt-3 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center"
                      onClick={() => handleCharacterModalOpen(character)}
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      List For Sale
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Marketplace Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center mb-6">
            <ShoppingBag className="h-5 w-5 mr-2 text-purple-600" />
            NFT Marketplace
          </h2>

          {/* Mobile Category Button */}
          <div className="md:hidden mb-4">
            <button className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <span className="flex items-center">
                <Filter className="h-4 w-4 mr-2" /> Categories
              </span>
              <Menu className="h-4 w-4" />
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
            {/* Categories */}
            <div className="hidden md:flex overflow-x-auto gap-2 pb-1 scrollbar-hide">
              {["All", "Red", "Yellow", "Green", "Blue", "Pink", "Rainbow"].map(
                (category) => (
                  <button
                    key={category}
                    className={`px-4 py-2 whitespace-nowrap rounded-full ${
                      category === "All"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    } transition-all`}
                  >
                    {category}
                  </button>
                ),
              )}
            </div>
            Filter buttons
            <div className="flex gap-2 ml-auto">
              <div className="relative">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              <div className="relative">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <span className="hidden sm:inline">Sort by</span>
                  <span className="sm:hidden">Sort</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* NFT Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {nfts.map((nft) => (
              <div
                key={nft.id}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1"
              >
                <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 group">
                  {/* NFT Image */}
                  <div
                    className={`w-full h-full ${getColorClass(nft.color)} flex items-center justify-center text-white font-bold relative`}
                  >
                    <div className="text-4xl opacity-30">
                      {nft.name.charAt(0)}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sword className="h-12 w-12 text-white opacity-30" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center w-full h-full">
                      <div
                        className="aspect-square bg-cover bg-center w-6/7 p-6"
                        style={{
                          backgroundImage: `url(${nft.image || "assets/char_" + nft.sprite.replace(/\D/g, "") + ".png"})`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Overlay Actions on Hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity">
                    <button className="p-2 bg-white rounded-full text-gray-800 hover:bg-gray-100 transition-colors">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="p-2 bg-white rounded-full text-gray-800 hover:bg-gray-100 transition-colors">
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Tier Badge */}
                  <div className="absolute top-2 right-2">
                    <div
                      className={`${getTierBadgeClass(nft.tier)} px-2 py-1 rounded-full text-xs font-semibold flex items-center`}
                    >
                      <Star className="h-3 w-3 mr-1" />
                      {nft.tier}
                    </div>
                  </div>

                  {/* Hot Tag for some characters */}
                  {(nft.luck > 0.14 ||
                    Math.round((nft.games_won / nft.games_played) * 100) ==
                      85) && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <Zap className="h-3 w-3 mr-1" /> Hot
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {nft.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        By {nft.owner_username || nft.owner_id.substring(0, 8)}
                      </p>
                    </div>
                    <div className="bg-purple-100 dark:bg-purple-900 dark:bg-opacity-30 px-2 py-1 rounded-md">
                      <p className="text-xs font-medium text-purple-800 dark:text-purple-300">
                        {nft.price} {nft.currency}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Star className="h-3 w-3 mr-1 text-yellow-500" />
                      Luck: {nft.luck}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Award className="h-3 w-3 mr-1 text-green-500" />
                      Played: {nft.games_played}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Award className="h-3 w-3 mr-1 text-green-500" />
                      Wins: {nft.games_won}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <TrendingUp className="h-3 w-3 mr-1 text-purple-500" />
                      {nft.games_played > 0
                        ? Math.round((nft.games_won / nft.games_played) * 100)
                        : 0}
                      % Win Rate
                    </div>
                  </div>

                  {/* Combat Stats */}
                  <div className="grid grid-cols-3 gap-1 mt-2">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Sword className="h-3 w-3 mr-1 text-red-500" />
                      ATK: {nft.atk}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Shield className="h-3 w-3 mr-1 text-blue-500" />
                      DEF: {nft.def}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Heart className="h-3 w-3 mr-1 text-green-500" />
                      HP: {nft.hp}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() =>
                        userInfo &&
                        buyNft(nft.owner_wallet, userInfo.user_id, nft.token_id)
                      }
                      className="px-3 py-1.5 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center"
                    >
                      <ShoppingBag className="h-3 w-3 mr-1" /> Buy Now
                    </button>
                    <button className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center">
                      <Eye className="h-3 w-3 mr-1" /> View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More / Pagination */}
          <div className="flex justify-center mt-10">
            <button className="px-6 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center">
              Load More <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
      {showReceipt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-semibold text-green-600">
              Transaction Successful!
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              Your NFT has been minted successfully.
            </p>

            <div className="mt-4">
              <p className="text-sm text-gray-500">📜 Contract Address:</p>
              <p className="font-mono text-sm break-all text-gray-900 dark:text-gray-200">
                0x7f9a6Ae21981fBa73450eF15CF27C5b1000fDBB1
              </p>

              <p className="text-sm text-gray-500 mt-2">🏷 Token ID:</p>
              <p className="font-mono text-lg text-blue-600">{tokenId}</p>
            </div>

            <button
              onClick={() => setReceipt(false)}
              className="mt-6 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplaceComponent;

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag,
  Filter,
  ChevronDown,
  PlusCircle,
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
} from "lucide-react";

// Mock NFT data for display purposes
const nfts = [
  {
    id: 1,
    name: "Cosmic Dreamer #344",
    creator: "0x7823...5a1d",
    price: 0.245,
    currency: "ETH",
    image: "/images/nft-placeholder-1.jpg",
  },
  {
    id: 2,
    name: "Digital Horizon #782",
    creator: "0x3f71...9c2e",
    price: 0.189,
    currency: "ETH",
    image: "/images/nft-placeholder-2.jpg",
  },
  {
    id: 3,
    name: "Abstract Dimensions #129",
    creator: "0x9a23...6d4f",
    price: 0.356,
    currency: "ETH",
    image: "/images/nft-placeholder-3.jpg",
  },
  {
    id: 4,
    name: "Neon Genesis #501",
    creator: "0x2b67...8e3a",
    price: 0.278,
    currency: "ETH",
    image: "/images/nft-placeholder-4.jpg",
  },
  {
    id: 5,
    name: "Cybernetic Fusion #92",
    creator: "0x5f19...3c7d",
    price: 0.412,
    currency: "ETH",
    image: "/images/nft-placeholder-5.jpg",
  },
  {
    id: 6,
    name: "Virtual Reality #238",
    creator: "0x8d45...7b2c",
    price: 0.195,
    currency: "ETH",
    image: "/images/nft-placeholder-6.jpg",
  },
];

// Mock Owned Characters
const ownedCharacters = [
  {
    id: "char_001",
    name: "Solar Knight",
    image: "/characters/solar-knight.jpg", // This would be a real image path
    tier: "Legendary",
    luck: 85,
    gamesPlayed: 47,
    gamesWon: 32,
    color: "yellow",
  },
  {
    id: "char_002",
    name: "Aqua Mage",
    image: "/characters/aqua-mage.jpg",
    tier: "Epic",
    luck: 72,
    gamesPlayed: 63,
    gamesWon: 40,
    color: "blue",
  },
  {
    id: "char_003",
    name: "Terra Guardian",
    image: "/characters/terra-guardian.jpg",
    tier: "Rare",
    luck: 60,
    gamesPlayed: 29,
    gamesWon: 17,
    color: "green",
  },
  {
    id: "char_004",
    name: "Shadow Assassin",
    image: "/characters/shadow-assassin.jpg",
    tier: "Epic",
    luck: 75,
    gamesPlayed: 51,
    gamesWon: 33,
    color: "purple",
  },
];

const Page = async () => {
  const session = await auth();
  if (!session) redirect("/");

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8">
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
          <Link href="/marketplace/sellCharacter">
            <button className="mt-4 md:mt-0 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>Sell New</span>
            </button>
          </Link>
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
              <Link
                key={character.id}
                href={`/marketplace/sellCharacter?id=${character.id}`}
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-1">
                  <div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
                    {/* Character Image placeholder - would be a real image in production */}
                    <div
                      className={`w-full h-full ${getColorClass(character.color)} flex items-center justify-center text-white font-bold relative`}
                    >
                      <div className="text-4xl opacity-30">
                        {character.name.charAt(0)}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sword className="h-12 w-12 text-white opacity-30" />
                      </div>
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
                      <div className="bg-gray-800 bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <Bookmark className="h-3 w-3 mr-1" />
                        Not Listed
                      </div>
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
                        Played: {character.gamesPlayed}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Award className="h-3 w-3 mr-1 text-green-500" />
                        Wins: {character.gamesWon}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <TrendingUp className="h-3 w-3 mr-1 text-purple-500" />
                        {Math.round(
                          (character.gamesWon / character.gamesPlayed) * 100,
                        )}
                        % Win Rate
                      </div>
                    </div>

                    <button className="mt-3 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      List For Sale
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center mb-6">
            <ShoppingBag className="h-5 w-5 mr-2 text-purple-600" />
            NFT Marketplace
          </h2>

          {/* Mobile Category Button (only visible on small screens) */}
          <div className="md:hidden mb-4">
            <button className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <span className="flex items-center">
                <Filter className="h-4 w-4 mr-2" /> Categories
              </span>
              <Menu className="h-4 w-4" />
            </button>
          </div>

          {/* Filters with better layout */}
          <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
            {/* Categories (hidden on mobile, now in a dropdown) */}
            <div className="hidden md:flex overflow-x-auto gap-2 pb-1 scrollbar-hide">
              {[
                "All",
                "Art",
                "Collectibles",
                "Music",
                "Photography",
                "Sports",
                "Trading Cards",
              ].map((category) => (
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
              ))}
            </div>

            {/* Filter buttons */}
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

          {/* NFT Grid with improved cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {nfts.map((nft) => (
              <div
                key={nft.id}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1"
              >
                <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 group">
                  {/* NFT Image */}
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-white text-opacity-30 text-4xl font-bold">
                    NFT
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

                  {/* Hot Tag for some items */}
                  {nft.id % 2 === 0 && (
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
                        By {nft.creator}
                      </p>
                    </div>
                    <div className="bg-purple-100 dark:bg-purple-900 dark:bg-opacity-30 px-2 py-1 rounded-md">
                      <p className="text-xs font-medium text-purple-800 dark:text-purple-300">
                        {nft.price} {nft.currency}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <button className="px-3 py-1.5 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center">
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
    </div>
  );
};

// Helper functions for character card styling
function getColorClass(color) {
  switch (color) {
    case "yellow":
      return "bg-gradient-to-br from-yellow-400 to-amber-600";
    case "blue":
      return "bg-gradient-to-br from-blue-400 to-indigo-600";
    case "green":
      return "bg-gradient-to-br from-green-400 to-emerald-600";
    case "purple":
      return "bg-gradient-to-br from-purple-400 to-indigo-600";
    default:
      return "bg-gradient-to-br from-gray-400 to-gray-600";
  }
}

function getTierBadgeClass(tier) {
  switch (tier) {
    case "Legendary":
      return "bg-yellow-500 text-yellow-900";
    case "Epic":
      return "bg-purple-500 text-purple-900";
    case "Rare":
      return "bg-blue-500 text-blue-900";
    case "Uncommon":
      return "bg-green-500 text-green-900";
    case "Common":
      return "bg-gray-500 text-gray-900";
    default:
      return "bg-gray-500 text-gray-900";
  }
}

export default Page;

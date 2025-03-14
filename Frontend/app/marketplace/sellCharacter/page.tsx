"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Info,
  ImagePlus,
  Shield,
  Sword,
  Sparkles,
  Tag,
  Save,
  Send,
  HelpCircle,
  X,
  BarChart2,
} from "lucide-react";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const session = await auth();
      if (!session) router.push("/");
    };
    checkAuth();
  }, [router]);

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header with back button */}
        <div className="mb-8">
          <Link
            href="/marketplace"
            className="inline-flex items-center text-purple-600 mb-6 hover:text-purple-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to Marketplace</span>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Sell Your Character
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Create and list your character as NFT in our marketplace
              </p>
            </div>
            <div className="mt-3 sm:mt-0 hidden sm:block">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-800 dark:bg-opacity-30 dark:text-purple-300">
                <Sparkles className="h-3 w-3 mr-1" /> Get featured: +20%
                visibility
              </span>
            </div>
          </div>
        </div>

        {/* Form with enhanced UI */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          {/* Progress Steps */}
          <div className="mb-8 px-2">
            <div className="flex justify-between items-center">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
                  1
                </div>
                <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                  Details
                </span>
              </div>
              <div className="h-1 flex-grow bg-gray-200 dark:bg-gray-700 mx-2"></div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 flex items-center justify-center">
                  2
                </div>
                <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                  Properties
                </span>
              </div>
              <div className="h-1 flex-grow bg-gray-200 dark:bg-gray-700 mx-2"></div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 flex items-center justify-center">
                  3
                </div>
                <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                  Price
                </span>
              </div>
            </div>
          </div>

          {/* Image Upload - Enhanced */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <ImagePlus className="h-4 w-4 mr-2" />
              Character Image
            </label>
            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900">
              <div className="space-y-2 text-center">
                <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900 dark:bg-opacity-30">
                  <Upload className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                  <label
                    htmlFor="character-image"
                    className="relative cursor-pointer rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none"
                  >
                    <span>Upload a file</span>
                    <input
                      id="character-image"
                      name="character-image"
                      type="file"
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center">
                  <Info className="h-3 w-3 mr-1" />
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>

          {/* Character Details - Enhanced */}
          <div className="space-y-6">
            {/* Name with icon */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
              >
                <Tag className="h-4 w-4 mr-2" />
                Character Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Enter character name"
                />
              </div>
            </div>

            {/* Description with enhanced UI */}
            <div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                >
                  <Info className="h-4 w-4 mr-2" />
                  Description
                </label>
                <span className="text-xs text-gray-500">0/1000</span>
              </div>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Describe your character's traits, backstory, or special abilities"
                ></textarea>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <HelpCircle className="h-3 w-3 mr-1" />
                Detailed descriptions help your character stand out in the
                marketplace
              </p>
            </div>

            {/* Character Properties - Enhanced with icons and better mobile layout */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <Sparkles className="h-4 w-4 mr-2" />
                Properties
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="level"
                      className="block text-xs text-gray-500 dark:text-gray-400 flex items-center"
                    >
                      <BarChart2 className="h-3 w-3 mr-1" />
                      Level
                    </label>
                  </div>
                  <input
                    type="number"
                    name="level"
                    id="level"
                    min="1"
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    placeholder="1"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="rarity"
                      className="block text-xs text-gray-500 dark:text-gray-400 flex items-center"
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      Rarity
                    </label>
                  </div>
                  <select
                    id="rarity"
                    name="rarity"
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  >
                    <option>Common</option>
                    <option>Uncommon</option>
                    <option>Rare</option>
                    <option>Epic</option>
                    <option>Legendary</option>
                  </select>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="attack"
                      className="block text-xs text-gray-500 dark:text-gray-400 flex items-center"
                    >
                      <Sword className="h-3 w-3 mr-1" />
                      Attack
                    </label>
                  </div>
                  <input
                    type="number"
                    name="attack"
                    id="attack"
                    min="0"
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    placeholder="50"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="defense"
                      className="block text-xs text-gray-500 dark:text-gray-400 flex items-center"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      Defense
                    </label>
                  </div>
                  <input
                    type="number"
                    name="defense"
                    id="defense"
                    min="0"
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    placeholder="30"
                  />
                </div>
              </div>

              {/* Add More Properties Button */}
              <button className="mt-3 text-sm text-purple-600 hover:text-purple-700 flex items-center">
                <span>+ Add more properties</span>
              </button>
            </div>

            {/* Pricing - Enhanced with tooltip */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                >
                  <Tag className="h-4 w-4 mr-2" />
                  Price
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
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 pl-3 pr-12 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-purple-500"
                  placeholder="0.00"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">ETH</span>
                </div>
              </div>
              {/* Price recommendation */}
              <p className="mt-1 text-xs text-purple-600 flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                Recommended price range: 0.05 - 0.3 ETH for similar characters
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-5">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
              >
                <Send className="h-4 w-4 mr-2" />
                Create & List Character
              </button>
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </button>
            </div>

            {/* Cancel button for mobile */}
            <div className="sm:hidden flex justify-center mt-2">
              <button className="text-gray-500 dark:text-gray-400 flex items-center">
                <X className="h-4 w-4 mr-1" /> Cancel
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

export default Page;

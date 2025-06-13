"use client";

import React, { useState, useEffect } from "react";
import { Crown, X, CreditCard } from "lucide-react";
import TopBanner from "./TopBanner";
import { getTestPackage } from "@/lib/userProfileTest";

export default function FreeTrialBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if banner should be visible based on package
    const checkVisibility = () => {
      const package_ = getTestPackage();
      const shouldShow = package_ === "free_trial";
      setIsVisible(shouldShow && !isDismissed);
    };

    // Initial check
    checkVisibility();

    // Check every 2 seconds for changes (in case test profile changes)
    const interval = setInterval(checkVisibility, 2000);

    return () => clearInterval(interval);
  }, [isDismissed]);

  // Load dismissed state from localStorage
  useEffect(() => {
    const dismissed = localStorage.getItem("freeTrialBannerDismissed");
    if (dismissed === "true") {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    localStorage.setItem("freeTrialBannerDismissed", "true");
  };

  const handleUpgrade = () => {
    // Navigate to upgrade page or open upgrade modal
    console.log("Navigate to upgrade page");
  };

  if (!isVisible) {
    return null;
  }

  return (
    <TopBanner
      bgColor="bg-gradient-to-r from-purple-600 to-blue-600"
      textColor="text-white"
      className="relative border-b border-purple-700 shadow-lg"
    >
      <div className="flex items-center justify-between w-full max-w-4xl">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Crown className="h-6 w-6 text-yellow-300" />
            <span className="font-semibold">Free Trial</span>
          </div>
          <div className="hidden sm:block text-sm">
            You&apos;re currently on a free trial. Upgrade to unlock all
            features and remove limitations.
          </div>
          <div className="block sm:hidden text-sm">
            Upgrade to unlock all features
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleUpgrade}
            className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2 text-sm"
          >
            <CreditCard className="h-4 w-4" />
            <span>Upgrade Now</span>
          </button>

          <button
            onClick={handleDismiss}
            className="text-white hover:text-gray-200 transition-colors p-1"
            aria-label="Dismiss banner"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </TopBanner>
  );
}

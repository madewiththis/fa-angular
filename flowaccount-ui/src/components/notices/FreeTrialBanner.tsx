"use client";

import React, { useState, useEffect } from "react";
import { Crown, CreditCard } from "lucide-react";
import { getTestPackage } from "@/lib/userProfileTest";
import Backdrop from "../common/Backdrop";
import { useBannerStore } from "@/stores/useBannerStore";
import { useMenuStore } from "@/stores/useMenuStore";

export default function FreeTrialBanner() {
  const [isHovered, setIsHovered] = useState(false);
  const { isBannerVisible, setIsBannerVisible } = useBannerStore();
  const isMenuCollapsed = useMenuStore((state) => state.isMenuCollapsed);

  const menuWidth = isMenuCollapsed ? "60px" : "100px";
  const expandedMenuWidth = "100px";

  useEffect(() => {
    const checkVisibility = () => {
      const package_ = getTestPackage();
      const shouldShow = package_ === "free_trial";
      setIsBannerVisible(shouldShow);
    };

    checkVisibility();
    const interval = setInterval(checkVisibility, 2000);

    return () => {
      clearInterval(interval);
      setIsBannerVisible(false);
    };
  }, [setIsBannerVisible]);

  const handleUpgrade = () => {
    console.log("Navigate to upgrade page");
  };

  if (!isBannerVisible) {
    return null;
  }

  return (
    <>
      <Backdrop
        isOpen={isHovered}
        onClick={() => setIsHovered(false)}
        zIndex="z-50"
      />

      {/* 
        This wrapper is the key to a flicker-free experience.
        It's a stable area that handles all mouse events. Its fixed height
        ensures that the mouse never unintentionally leaves the hover zone.
      */}
      <div
        className="relative h-[50px] z-[60]"
        style={{ marginLeft: menuWidth }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Collapsed Banner Content */}
        <div
          className={`
            w-full h-full bg-black text-white border-b border-gray-800 shadow-lg 
            flex items-center justify-center 
            transition-opacity duration-300
            ${isHovered ? "opacity-0" : "opacity-100"}
          `}
        >
          <div className="flex items-center justify-between w-full max-w-4xl px-4">
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
            <div className="flex items-center">
              <button
                onClick={handleUpgrade}
                className="bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2 text-sm"
              >
                <CreditCard className="h-4 w-4" />
                <span>Upgrade Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Banner (Overlay) */}
        {isHovered && (
          <div
            className="fixed top-0 z-[60] h-[300px] p-5 pointer-events-none"
            style={{ left: expandedMenuWidth, right: 0 }}
          >
            <div className="w-full h-full bg-black text-white rounded-lg border border-gray-800 shadow-lg flex items-center justify-center pointer-events-auto">
              <div className="flex flex-col space-y-6 h-full justify-center w-full max-w-4xl items-center text-center">
                <div className="flex flex-col space-y-4 text-center items-center">
                  <div className="flex items-center space-x-2">
                    <Crown className="h-12 w-12 text-yellow-300" />
                    <span className="font-semibold text-2xl">Free Trial</span>
                  </div>
                  <p className="text-lg max-w-lg leading-relaxed">
                    You&apos;re currently on a free trial. Upgrade to unlock all
                    premium features, remove limitations, and get access to
                    advanced analytics, unlimited projects, and priority
                    support.
                  </p>
                </div>

                <div className="flex items-center justify-center">
                  <button
                    onClick={handleUpgrade}
                    className="bg-white text-black px-8 py-4 text-lg font-semibold hover:bg-gray-100 flex items-center space-x-2 rounded-lg"
                  >
                    <CreditCard className="h-6 w-6" />
                    <span>Upgrade Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

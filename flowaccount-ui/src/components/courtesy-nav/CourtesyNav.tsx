"use client";

import React, { useEffect, useState } from "react";
import CompanyChanger from "./CompanyChanger";
import LanguageChanger from "./LanguageChanger";
import HelpCenterButton from "./HelpCenterButton";
import { useBannerStore } from "@/stores/useBannerStore";

export default function CourtesyNav() {
  const isBannerVisible = useBannerStore((state) => state.isBannerVisible);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ease-in-out ${
        isClient && isBannerVisible ? "top-[66px]" : "top-4"
      }`}
    >
      <div className="flex items-center space-x-2">
        <CompanyChanger />
        <LanguageChanger />
        <HelpCenterButton />
      </div>
    </div>
  );
}

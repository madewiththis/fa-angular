"use client";

import React from "react";
import CompanyChanger from "./CompanyChanger";
import LanguageChanger from "./LanguageChanger";
import HelpCenterButton from "./HelpCenterButton";

interface CourtesyNavProps {
  className?: string;
}

export default function CourtesyNav({ className = "" }: CourtesyNavProps) {
  return (
    <div
      className={`fixed right-4 z-40 flex items-center gap-3 ${className}`}
      style={{
        top: `calc(var(--banner-height, 0px) + 1rem)`, // 1rem = 16px spacing
      }}
    >
      <CompanyChanger />
      <LanguageChanger />
      <HelpCenterButton />
    </div>
  );
}

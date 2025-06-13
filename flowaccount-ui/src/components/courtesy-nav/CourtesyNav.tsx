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
      className={`fixed top-4 right-4 z-40 flex items-center gap-3 ${className}`}
    >
      <CompanyChanger />
      <LanguageChanger />
      <HelpCenterButton />
    </div>
  );
}

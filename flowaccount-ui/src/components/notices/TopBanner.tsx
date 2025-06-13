"use client";

import React, { useEffect } from "react";

export interface TopBannerProps {
  children?: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  height?: string;
  className?: string;
}

export default function TopBanner({
  children,
  bgColor = "bg-blue-500",
  textColor = "text-white",
  height = "h-[80px]",
  className = "",
}: TopBannerProps) {
  useEffect(() => {
    // Set CSS custom property for banner height
    document.documentElement.style.setProperty("--banner-height", "80px");

    return () => {
      // Clean up when component unmounts
      document.documentElement.style.setProperty("--banner-height", "0px");
    };
  }, []);

  return (
    <div className={`w-full ${height} ${bgColor} ${textColor} ${className}`}>
      <div className="container mx-auto h-full flex items-center justify-center px-4">
        {children}
      </div>
    </div>
  );
}

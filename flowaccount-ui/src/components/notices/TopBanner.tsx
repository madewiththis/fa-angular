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
    // Extract height value from Tailwind class and set CSS custom property
    const heightValue = height.includes("h-[")
      ? height.match(/h-\[(\d+)px\]/)?.[1] + "px"
      : "80px";

    document.documentElement.style.setProperty("--banner-height", heightValue);

    return () => {
      // Clean up when component unmounts
      document.documentElement.style.setProperty("--banner-height", "0px");
    };
  }, [height]);

  return (
    <div className={`w-full ${height} ${bgColor} ${textColor} ${className}`}>
      <div className="container mx-auto h-full flex items-center justify-center px-4">
        {children}
      </div>
    </div>
  );
}

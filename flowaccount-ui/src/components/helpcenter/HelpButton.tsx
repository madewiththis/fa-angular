"use client";

import { useState, useEffect } from "react";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";

interface HelpButtonProps {
  onClick: () => void;
  className?: string;
  isOpen: boolean;
}

export default function HelpButton({
  onClick,
  className = "",
  isOpen,
}: HelpButtonProps) {
  const [isVisible, setIsVisible] = useState(!isOpen);
  const [shouldFadeIn, setShouldFadeIn] = useState(!isOpen);

  useEffect(() => {
    if (isOpen) {
      // Hide immediately when help center opens
      setIsVisible(false);
      setShouldFadeIn(false);
    } else {
      // Wait for panel transition to complete (300ms) then fade in
      const timer = setTimeout(() => {
        setIsVisible(true);
        // Small delay to trigger fade-in after visibility is set
        setTimeout(() => setShouldFadeIn(true), 10);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className={`fixed top-4 right-4 z-50 text-white p-3 rounded-full shadow-lg transition-all duration-500 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        shouldFadeIn ? "opacity-100" : "opacity-0"
      } ${className}`}
      style={{
        backgroundColor: "#1286c4",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#0f6fa8";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#148dce";
      }}
      aria-label="Open help center"
    >
      <LiveHelpIcon sx={{ fontSize: 24 }} />
    </button>
  );
}

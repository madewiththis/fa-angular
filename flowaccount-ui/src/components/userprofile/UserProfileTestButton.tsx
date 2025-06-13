"use client";

import React, { useState, useEffect } from "react";
import ProfilesIcon from "@mui/icons-material/ManageAccounts";
import {
  isTestingEnabled,
  getUserProfileTestCriteria,
} from "../../lib/userProfileTest";

interface UserProfileTestButtonProps {
  onClick: () => void;
}

const UserProfileTestButton: React.FC<UserProfileTestButtonProps> = ({
  onClick,
}) => {
  const [hasActiveTests, setHasActiveTests] = useState(false);
  const [activeCriteriaText, setActiveCriteriaText] = useState("");

  const getActiveCriteriaText = () => {
    const criteria = getUserProfileTestCriteria();
    const activeCriteria: string[] = [];

    if (criteria.userRole !== "any") activeCriteria.push(criteria.userRole);
    if (criteria.package !== "any") activeCriteria.push(criteria.package);
    if (criteria.packageStatus !== "any")
      activeCriteria.push(criteria.packageStatus);
    if (criteria.paymentFrequency !== "any")
      activeCriteria.push(criteria.paymentFrequency);
    if (criteria.paymentMethod !== "any")
      activeCriteria.push(criteria.paymentMethod);

    return activeCriteria.join(" • ");
  };

  useEffect(() => {
    // Check if testing is enabled when component mounts
    const isActive = isTestingEnabled();
    setHasActiveTests(isActive);
    setActiveCriteriaText(isActive ? getActiveCriteriaText() : "");

    // Check periodically for changes (in case other tabs update the criteria)
    const interval = setInterval(() => {
      const isActive = isTestingEnabled();
      setHasActiveTests(isActive);
      setActiveCriteriaText(isActive ? getActiveCriteriaText() : "");
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      <button
        onClick={onClick}
        className={`
          flex items-center gap-2 px-4 py-3 
          rounded-full shadow-lg transition-all duration-200 hover:scale-105
          ${
            hasActiveTests
              ? "bg-orange-500 hover:bg-orange-600 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }
        `}
        title={
          hasActiveTests
            ? "User Profile Testing Active"
            : "Open User Profile Testing"
        }
      >
        {hasActiveTests ? (
          <>
            <ProfilesIcon className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">
              Testing Active
            </span>
          </>
        ) : (
          <>
            <ProfilesIcon className="w-5 h-5" />
          </>
        )}

        {hasActiveTests && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        )}
      </button>

      {hasActiveTests && activeCriteriaText && (
        <div className="bg-black bg-opacity-80 text-white text-xs px-3 py-1 rounded-lg shadow-lg max-w-xs truncate">
          {activeCriteriaText}
        </div>
      )}
    </div>
  );
};

export default UserProfileTestButton;

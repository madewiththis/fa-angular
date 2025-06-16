"use client";

import React, { useState } from "react";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import HelpCenter from "../helpcenter/HelpCenter";
import Backdrop from "../common/Backdrop";

export default function HelpCenterButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        aria-label="Open help center"
      >
        <LiveHelpIcon className="text-gray-600" style={{ fontSize: 20 }} />
        <span className="text-sm font-medium text-gray-700">Help</span>
      </button>
      <Backdrop isOpen={isOpen} onClick={handleClose} />
      <HelpCenter isOpen={isOpen} onClose={handleClose} />
    </>
  );
}

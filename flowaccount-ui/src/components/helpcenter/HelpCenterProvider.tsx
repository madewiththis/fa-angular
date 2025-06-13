"use client";

import { useState } from "react";
import HelpButton from "./HelpButton";
import HelpCenter from "./HelpCenter";

interface HelpCenterProviderProps {
  className?: string;
}

export default function HelpCenterProvider({
  className = "",
}: HelpCenterProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <HelpButton onClick={handleOpen} className={className} isOpen={isOpen} />
      <HelpCenter isOpen={isOpen} onClose={handleClose} />
    </>
  );
}

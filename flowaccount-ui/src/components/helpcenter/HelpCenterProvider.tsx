"use client";

import { useState } from "react";
import HelpButton from "./HelpButton";
import HelpCenter from "./HelpCenter";
import Backdrop from "../common/Backdrop";

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
      <Backdrop isOpen={isOpen} onClick={handleClose} />
      <HelpCenter isOpen={isOpen} onClose={handleClose} />
    </>
  );
}

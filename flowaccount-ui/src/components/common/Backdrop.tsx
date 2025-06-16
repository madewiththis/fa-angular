"use client";

interface BackdropProps {
  isOpen: boolean;
  onClick: () => void;
  zIndex?: string;
}

export default function Backdrop({
  isOpen,
  onClick,
  zIndex = "z-40",
}: BackdropProps) {
  return (
    <div
      onClick={onClick}
      className={`fixed inset-0 bg-white/30 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${zIndex} ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden="true"
    />
  );
}

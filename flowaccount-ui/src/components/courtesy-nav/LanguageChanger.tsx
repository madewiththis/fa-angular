"use client";

import React, { useState, useRef, useEffect } from "react";
import TranslateIcon from "@mui/icons-material/Translate";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckIcon from "@mui/icons-material/Check";

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: "EN", name: "English", flag: "🇺🇸" },
  { code: "TH", name: "ไทย", flag: "🇹🇭" },
];

export default function LanguageChanger() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    languages[0]
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    setIsOpen(false);
    // Here you would typically trigger a language change in your app
    console.log(`Language changed to: ${language.code}`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        aria-label="Change language"
      >
        <TranslateIcon className="text-gray-600" style={{ fontSize: 20 }} />
        <span className="text-sm font-medium text-gray-700">
          {selectedLanguage.code}
        </span>
        <ExpandMoreIcon
          className={`text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          style={{ fontSize: 18 }}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0 ${
                  selectedLanguage.code === language.code ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{language.flag}</span>
                    <div>
                      <div
                        className={`text-sm font-medium ${
                          selectedLanguage.code === language.code
                            ? "text-blue-700"
                            : "text-gray-700"
                        }`}
                      >
                        {language.name}
                      </div>
                      <div
                        className={`text-xs ${
                          selectedLanguage.code === language.code
                            ? "text-blue-600"
                            : "text-gray-500"
                        }`}
                      >
                        {language.code}
                      </div>
                    </div>
                  </div>
                  {selectedLanguage.code === language.code && (
                    <CheckIcon
                      className="text-blue-600"
                      style={{ fontSize: 18 }}
                    />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

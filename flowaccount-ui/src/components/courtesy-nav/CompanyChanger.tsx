"use client";

import React, { useState, useRef, useEffect } from "react";
import BusinessIcon from "@mui/icons-material/Business";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";

interface Company {
  id: string;
  name: string;
}

// Mock company data - replace with actual data source
const mockCompanies: Company[] = [
  { id: "1", name: "FlowAccount Co., Ltd." },
  { id: "2", name: "Acme Corporation" },
  { id: "3", name: "Tech Solutions Inc." },
  { id: "4", name: "Global Trading Ltd." },
  { id: "5", name: "Innovation Hub Co." },
  { id: "6", name: "Digital Marketing Agency" },
  { id: "7", name: "Financial Services Group" },
];

export default function CompanyChanger() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company>(
    mockCompanies[0]
  );
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredCompanies = mockCompanies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        aria-label="Change company"
      >
        <BusinessIcon className="text-gray-600" style={{ fontSize: 20 }} />
        <span className="text-sm font-medium text-gray-700 max-w-[150px] truncate">
          {selectedCompany.name}
        </span>
        <ExpandMoreIcon
          className={`text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          style={{ fontSize: 18 }}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <SearchIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                style={{ fontSize: 18 }}
              />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => handleCompanySelect(company)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0 ${
                    selectedCompany.id === company.id
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BusinessIcon
                      className={
                        selectedCompany.id === company.id
                          ? "text-blue-600"
                          : "text-gray-400"
                      }
                      style={{ fontSize: 18 }}
                    />
                    <span className="text-sm font-medium">{company.name}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-gray-500 text-sm">
                No companies found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

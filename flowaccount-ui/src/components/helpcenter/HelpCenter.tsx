"use client";

import { useState, useEffect } from "react";
import {
  HelpCircle,
  X,
  BookOpen,
  Video,
  MessageCircle,
  FileText,
} from "lucide-react";

interface HelpCenterProps {
  className?: string;
}

export default function HelpCenter({ className = "" }: HelpCenterProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close panel on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // Prevent scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Help Button - Fixed position in top right */}
      <button
        onClick={togglePanel}
        className={`fixed top-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
        aria-label="Open help center"
      >
        <HelpCircle size={24} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Help Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">
            Learning Center
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            aria-label="Close help center"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Quick Start */}
            <section>
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <BookOpen size={20} className="mr-2 text-blue-600" />
                Quick Start
              </h3>
              <div className="space-y-3">
                <a
                  href="#"
                  className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 border border-gray-200"
                >
                  <div className="font-medium text-gray-800">
                    Getting Started Guide
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Learn the basics of FlowAccount in 5 minutes
                  </div>
                </a>
                <a
                  href="#"
                  className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 border border-gray-200"
                >
                  <div className="font-medium text-gray-800">
                    Setup Your Account
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Configure your business profile and preferences
                  </div>
                </a>
              </div>
            </section>

            {/* Video Tutorials */}
            <section>
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <Video size={20} className="mr-2 text-green-600" />
                Video Tutorials
              </h3>
              <div className="space-y-3">
                <a
                  href="#"
                  className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 border border-gray-200"
                >
                  <div className="font-medium text-gray-800">
                    Creating Your First Invoice
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    3:45 • Step-by-step invoice creation
                  </div>
                </a>
                <a
                  href="#"
                  className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 border border-gray-200"
                >
                  <div className="font-medium text-gray-800">
                    Managing Expenses
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    5:20 • Track and categorize your expenses
                  </div>
                </a>
              </div>
            </section>

            {/* Support */}
            <section>
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <MessageCircle size={20} className="mr-2 text-purple-600" />
                Support
              </h3>
              <div className="space-y-3">
                <a
                  href="#"
                  className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 border border-gray-200"
                >
                  <div className="font-medium text-gray-800">Live Chat</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Get instant help from our support team
                  </div>
                </a>
                <a
                  href="#"
                  className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 border border-gray-200"
                >
                  <div className="font-medium text-gray-800">Email Support</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Send us a message and we'll respond within 24 hours
                  </div>
                </a>
              </div>
            </section>

            {/* Documentation */}
            <section>
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <FileText size={20} className="mr-2 text-orange-600" />
                Documentation
              </h3>
              <div className="space-y-3">
                <a
                  href="#"
                  className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 border border-gray-200"
                >
                  <div className="font-medium text-gray-800">
                    API Documentation
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Complete API reference and examples
                  </div>
                </a>
                <a
                  href="#"
                  className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 border border-gray-200"
                >
                  <div className="font-medium text-gray-800">
                    Feature Guides
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Detailed guides for advanced features
                  </div>
                </a>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Can't find what you're looking for?
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

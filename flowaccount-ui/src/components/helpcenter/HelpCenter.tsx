"use client";

import { useEffect } from "react";
import { X, BookOpen, Video, MessageCircle, FileText } from "lucide-react";

interface HelpCenterProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export default function HelpCenter({ isOpen, onClose }: HelpCenterProps) {
  // Close panel on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

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

  return (
    <>
      {/* Help Panel */}
      <div
        className={`fixed top-5 right-5 h-[calc(100vh-40px)] w-1/2 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out rounded-3xl ${
          isOpen ? "translate-x-0" : "translate-x-[calc(100%+20px)]"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50 rounded-t-3xl">
          <h2 className="text-xl font-semibold text-gray-800">
            Learning Center
          </h2>
          <button
            onClick={onClose}
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
                    Send us a message and we&apos;ll respond within 24 hours
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
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-3xl">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Can&apos;t find what you&apos;re looking for?
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

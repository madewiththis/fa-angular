"use client";

import React, { useState, useEffect } from "react";
import { X, TestTube, RotateCcw } from "lucide-react";
import {
  UserProfileTestCriteria,
  saveUserProfileTestCriteria,
  getUserProfileTestCriteria,
  resetUserProfileTestCriteria,
} from "../../lib/userProfileTest";

interface UserProfileTestPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileTestPanel: React.FC<UserProfileTestPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const [criteria, setCriteria] = useState<UserProfileTestCriteria>({
    userRole: "Any",
    package: "Any",
    packageStatus: "any",
    paymentFrequency: "any",
    paymentMethod: "any",
  });

  useEffect(() => {
    if (isOpen) {
      setCriteria(getUserProfileTestCriteria());
    }
  }, [isOpen]);

  const handleSave = () => {
    saveUserProfileTestCriteria(criteria);
    onClose();
  };

  const handleReset = () => {
    resetUserProfileTestCriteria();
    setCriteria({
      userRole: "Any",
      package: "Any",
      packageStatus: "any",
      paymentFrequency: "any",
      paymentMethod: "any",
    });
  };

  const updateCriteria = (
    field: keyof UserProfileTestCriteria,
    value: string
  ) => {
    setCriteria((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <TestTube className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              User Profile Testing
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User Role
            </label>
            <select
              value={criteria.userRole}
              onChange={(e) =>
                updateCriteria(
                  "userRole",
                  e.target.value as UserProfileTestCriteria["userRole"]
                )
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Any">Any</option>
              <option value="Owner">Owner</option>
              <option value="Staff">Staff</option>
              <option value="Accounting">Accounting</option>
              <option value="Firm">Firm</option>
              <option value="Freelance">Freelance</option>
              <option value="Accountant">Accountant</option>
              <option value="Student">Student</option>
            </select>
          </div>

          {/* Package */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Package
            </label>
            <select
              value={criteria.package}
              onChange={(e) =>
                updateCriteria(
                  "package",
                  e.target.value as UserProfileTestCriteria["package"]
                )
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Any">Any</option>
              <option value="Free Trial">Free Trial</option>
              <option value="Standard">Standard</option>
              <option value="Pro">Pro</option>
              <option value="Pro Business">Pro Business</option>
            </select>
          </div>

          {/* Package Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Package Status
            </label>
            <select
              value={criteria.packageStatus}
              onChange={(e) =>
                updateCriteria(
                  "packageStatus",
                  e.target.value as UserProfileTestCriteria["packageStatus"]
                )
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="any">Any</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="expiring">Expiring</option>
            </select>
          </div>

          {/* Payment Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Frequency
            </label>
            <select
              value={criteria.paymentFrequency}
              onChange={(e) =>
                updateCriteria(
                  "paymentFrequency",
                  e.target.value as UserProfileTestCriteria["paymentFrequency"]
                )
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="any">Any</option>
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
            </select>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <select
              value={criteria.paymentMethod}
              onChange={(e) =>
                updateCriteria(
                  "paymentMethod",
                  e.target.value as UserProfileTestCriteria["paymentMethod"]
                )
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="any">Any</option>
              <option value="credit card">Credit Card</option>
              <option value="bank transfer">Bank Transfer</option>
              <option value="qr code">QR Code</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 bg-gray-50 border-t border-gray-200">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Save & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileTestPanel;

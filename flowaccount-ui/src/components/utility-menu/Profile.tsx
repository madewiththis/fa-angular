import React, { useState } from "react";
import MailIcon from "@mui/icons-material/Mail";
import CallIcon from "@mui/icons-material/Call";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import TranslateIcon from "@mui/icons-material/Translate";
import BusinessIcon from "@mui/icons-material/Business";
import LogoutIcon from "@mui/icons-material/Logout";
import ChatIcon from "@mui/icons-material/Chat";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PhoneCallbackIcon from "@mui/icons-material/PhoneCallback";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// UserDetails Component
const UserDetails = () => {
  return (
    <div className="bg-blue-50 rounded-lg">
      <div className="p-4 relative">
        <button className="absolute top-4 right-4 w-8 h-8 bg-white hover:bg-gray-100 hover:shadow-md border border-gray-200 rounded-full flex items-center justify-center transition-all duration-200">
          <ManageAccountsIcon style={{ fontSize: 18 }} />
        </button>
        <p className="font-semibold pr-12">Firstname Lastname</p>
        <p className="text-sm text-gray-600 flex items-center">
          <MailIcon
            className="mr-2"
            style={{ fontSize: 18, verticalAlign: "middle" }}
          />
          email@example.com
        </p>
        <p className="text-sm text-gray-600 flex items-center">
          <CallIcon
            className="mr-2"
            style={{ fontSize: 18, verticalAlign: "middle" }}
          />
          012-345-6789
        </p>
      </div>
    </div>
  );
};

// Support Component
const Support = () => {
  const [phoneNumberCopied, setPhoneNumberCopied] = useState(false);
  const [customerNumberCopied, setCustomerNumberCopied] = useState(false);

  const phoneNumber = "02-026-8989";
  const customerNumber = "N12353353";

  const handleCopy = (
    textToCopy: string,
    setCopied: (copied: boolean) => void
  ) => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000); // Revert back to copy icon after 2 seconds
    });
  };

  return (
    <div className="p-2">
      <div className="flex mt-2 space-x-2">
        <button className="flex-1 p-2 bg-white hover:bg-blue-50 rounded-md relative flex flex-col items-center justify-center transition-colors border border-gray-200 min-h-[80px]">
          <ChatIcon />
          <span className="text-xs text-gray-500 mt-1 text-center">
            Mon-Sat
            <br />
            08:00-22:00
          </span>
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-green-400 ring-2 ring-white"></span>
        </button>
        <button
          onClick={() => handleCopy(phoneNumber, setPhoneNumberCopied)}
          className="flex-1 p-2 bg-white hover:bg-blue-50 rounded-md flex flex-col items-center justify-center transition-colors border border-gray-200 min-h-[80px]"
        >
          <SupportAgentIcon />
          <div className="flex items-center text-xs text-gray-800 mt-1">
            <span>{phoneNumber}</span>
            {phoneNumberCopied ? (
              <CheckCircleIcon
                className="text-green-500 ml-1"
                style={{ fontSize: 16 }}
              />
            ) : (
              <ContentCopyIcon
                className="text-gray-600 ml-1"
                style={{ fontSize: 16 }}
              />
            )}
          </div>
        </button>
      </div>
      <div className="mt-2">
        <button className="w-full p-2 bg-gray-50 hover:bg-gray-100 rounded-md flex items-center justify-center transition-colors border border-gray-200 min-h-[40px]">
          <PhoneCallbackIcon className="mr-2" />
          Request Callback
        </button>
      </div>
      <div className="mt-2">
        <button
          onClick={() => handleCopy(customerNumber, setCustomerNumberCopied)}
          className="flex items-center justify-between w-full text-sm p-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          style={{ textAlign: "left" }}
        >
          <span className="flex items-center">
            <LoyaltyIcon
              className="mr-2"
              style={{ fontSize: 18, verticalAlign: "middle" }}
            />
            <span className="flex flex-col">
              <span className="ml-0 text-gray-800 font-medium">
                {customerNumber}
              </span>
            </span>
          </span>
          {customerNumberCopied ? (
            <CheckCircleIcon
              className="text-green-500 ml-2"
              style={{ fontSize: 18, verticalAlign: "middle" }}
            />
          ) : (
            <ContentCopyIcon
              className="text-gray-600 ml-2"
              style={{ fontSize: 18, verticalAlign: "middle" }}
            />
          )}
        </button>
      </div>
    </div>
  );
};

// LanguageSelector Component
const LanguageSelector = () => (
  <div className="p-4 flex justify-between items-center">
    <p className="text-sm flex items-center">
      <TranslateIcon
        className="mr-1"
        style={{ fontSize: 18, verticalAlign: "middle" }}
      />
      Language
    </p>
    <div>
      <button className="text-sm py-1 px-2 border rounded-md bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition-colors">
        EN
      </button>
      <button className="text-sm py-1 px-2 border rounded-md ml-2 bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors">
        TH
      </button>
    </div>
  </div>
);

// ChooseCompanyButton Component
const ChooseCompanyButton = () => (
  <div className="p-2">
    <button className="w-full p-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-between">
      <div className="flex items-center">
        <BusinessIcon
          className="mr-2"
          style={{ fontSize: 18, verticalAlign: "middle" }}
        />
        Change Company
      </div>
      <ChevronRightIcon style={{ fontSize: 18, verticalAlign: "middle" }} />
    </button>
  </div>
);

// LogoutButton Component
const LogoutButton = () => (
  <div className="p-2">
    <button className="w-full p-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center justify-start">
      <span className="flex-1 flex items-center justify-center">
        <LogoutIcon
          className="mr-2"
          style={{ fontSize: 18, verticalAlign: "middle" }}
        />
        Logout
      </span>
    </button>
  </div>
);

const Profile = () => {
  return (
    <div
      style={{ width: "300px" }}
      className="flex flex-col bg-white rounded-lg text-gray-800"
    >
      <UserDetails />
      <Support />
      <ChooseCompanyButton />
      <LanguageSelector />
      <LogoutButton />
    </div>
  );
};

export default Profile;

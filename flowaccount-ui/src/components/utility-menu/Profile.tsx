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
import PhoneCallbackIcon from "@mui/icons-material/PhoneCallback";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// UserDetails Component
import EditIcon from "@mui/icons-material/Edit";

const UserDetails = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      className="bg-blue-50 rounded-lg w-full text-left relative group focus:outline-none"
      style={{ cursor: "pointer" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
    >
      <div className="p-4">
        {/* Edit pill appears on hover */}
        <div
          className={`absolute top-4 right-4 transition-opacity duration-200 ${
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <span className="flex items-center bg-white border border-gray-200 shadow px-3 py-1 rounded-full text-sm font-medium text-gray-700 transition-colors duration-150 group-hover:bg-[#226CDF] group-hover:text-white">
            <EditIcon className="mr-1" style={{ fontSize: 18 }} />
            Edit
          </span>
        </div>
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
    </button>
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
        <button className="flex-1 p-3 bg-white hover:bg-blue-50 rounded-md relative flex flex-col items-center justify-center transition-colors border border-gray-200 min-h-[80px]">
          <div className="flex items-center">
            <ChatIcon style={{ fontSize: 24 }} />
            <span className="text-base font-medium ml-2">Chat</span>
          </div>
        </button>
        <button
          onClick={() => handleCopy(phoneNumber, setPhoneNumberCopied)}
          className="flex-1 p-3 bg-white hover:bg-blue-50 rounded-md relative flex flex-col items-center justify-center transition-colors border border-gray-200 min-h-[80px]"
        >
          <div className="flex items-center mb-2">
            <CallIcon style={{ fontSize: 24 }} />
            <span className="text-base font-medium ml-2">Call</span>
          </div>
          <div className="flex items-center justify-center text-xs text-gray-800">
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
        <button className="w-full p-2 bg-white hover:bg-blue-50 rounded-md flex items-center justify-center transition-colors border border-gray-200 min-h-[40px]">
          <PhoneCallbackIcon className="mr-2" />
          Request Callback
        </button>
      </div>
      <div className="mt-2">
        <button
          onClick={() => handleCopy(customerNumber, setCustomerNumberCopied)}
          className="flex items-center justify-between w-full text-sm p-2 bg-white hover:bg-gray-200 rounded-md transition-colors border border-gray-200"
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
  <div className="pl-2 pr-2 pb-1 pt-4 flex justify-between items-center">
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
  <div className="pl-2 pr-2 pb-1 pt-4">
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
      <LanguageSelector />
      <Support />
      <ChooseCompanyButton />
      <LogoutButton />
    </div>
  );
};

export default Profile;

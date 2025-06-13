"use client";

import React, { useState } from "react";
import UserProfileTestButton from "./UserProfileTestButton";
import UserProfileTestPanel from "./UserProfileTestPanel";

const UserProfileTester: React.FC = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const openPanel = () => setIsPanelOpen(true);
  const closePanel = () => setIsPanelOpen(false);

  return (
    <>
      <UserProfileTestButton onClick={openPanel} />
      <UserProfileTestPanel isOpen={isPanelOpen} onClose={closePanel} />
    </>
  );
};

export default UserProfileTester;

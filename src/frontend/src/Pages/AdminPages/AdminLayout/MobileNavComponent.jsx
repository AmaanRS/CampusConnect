import React, { useState } from "react";
import BottomBarComponent from "./BottomBarComponent";
import MobileDrawer from "../../../Components/Layout/mobile/Sidebar/MobileDrawer";
import MobileSidebarComponent from "./MobileSidebarComponent";

export default function MobileNavComponent() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  return (
    <>
      <BottomBarComponent
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      />
      <MobileDrawer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      >
        <MobileSidebarComponent setIsDrawerOpen={setIsDrawerOpen} />
      </MobileDrawer>
    </>
  );
}

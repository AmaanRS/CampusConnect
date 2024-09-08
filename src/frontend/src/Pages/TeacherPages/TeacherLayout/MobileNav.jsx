/* eslint-disable react/prop-types */
import { useState } from "react";
import MobileDrawer from "./MobileDrawer";
import BottomBarComponent from "./BottomBarComponent";
import MobileSidebar from "./MobileSidebarComponent";

export default function MobileNav() {
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
        <MobileSidebar setIsDrawerOpen={setIsDrawerOpen} />
      </MobileDrawer>
    </>
  );
}

/* eslint-disable react/prop-types */
import { useState } from "react";
import MobileDrawer from "../../../Components/Layout/mobile/Sidebar/MobileDrawer";
import BottomBarComponent from "./BottomBarComponent";
import MobileSidebarComponent from "./MobileSidebarComponent";
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
        <MobileSidebarComponent setIsDrawerOpen={setIsDrawerOpen} />
      </MobileDrawer>
    </>
  );
}

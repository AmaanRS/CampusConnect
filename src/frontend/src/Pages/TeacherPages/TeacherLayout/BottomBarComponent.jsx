import React from "react";
import BottomBar from "./BottomBar";
import BottomBarItem from "./BottomBarItem";
import { FaHome, FaSearch } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import BottomBarButton from "./BottomBarButton";

export default function BottomBarComponent({ isDrawerOpen, setIsDrawerOpen }) {
  const iconCss = "text-gray-500 group-hover:text-blue-600";

  return (
    <BottomBar isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen}>
      {/* button 1 */}
      <BottomBarItem
        to={"/teacher"}
        icon={<FaHome className={iconCss} size={25} />}
        text={"home"}
      />
      {/* button 2 */}

      <BottomBarItem
        icon={<FaSearch className={iconCss} size={25} />}
        text={"Search"}
      />
      {/* button 3 */}

      <BottomBarItem
        icon={<FaUserGroup className={iconCss} size={25} />}
        text={"Committee"}
      />
      {/* button 4 */}
      <BottomBarButton setIsDrawerOpen={setIsDrawerOpen} iconCss={iconCss} />
    </BottomBar>
  );
}

import React from "react";
import BottomBar from "../../../Components/Layout/mobile/BottomBar/BottomBar";
import BottomBarButton from "../../../Components/Layout/mobile/BottomBar/BottomBarButton";
import BottomBarItem from "../../../Components/Layout/mobile/BottomBar/BottomBarItem";
import { FaHome, FaSearch } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";

export default function BottomBarComponent({ isDrawerOpen, setIsDrawerOpen }) {
  const iconCss = "text-gray-500 group-hover:text-blue-600";

  return (
    <BottomBar isDrawerOpen={isDrawerOpen}>
      <BottomBarItem
        icon={<FaHome className={iconCss} size={25} />}
        text={"Home"}
        to={"/student"}
      />
      <BottomBarItem
        icon={<FaSearch className={iconCss} size={25} />}
        text={"Search"}
        to={"page2"}
      />
      <BottomBarItem
        icon={<FaUserGroup className={iconCss} size={25} />}
        text={"Committee"}
        to={"page3"}
      />
      <BottomBarButton iconCss={iconCss} setIsDrawerOpen={setIsDrawerOpen} />
    </BottomBar>
  );
}

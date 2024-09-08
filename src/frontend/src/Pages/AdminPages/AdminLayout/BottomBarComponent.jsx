import React from "react";
import BottomBar from "../../../Components/Layout/mobile/BottomBar/BottomBar";
import BottomBarItem from "../../../Components/Layout/mobile/BottomBar/BottomBarItem";
import { FaHome, FaSearch } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import BottomBarButton from "../../../Components/Layout/mobile/BottomBar/BottomBarButton";

export default function BottomBarComponent({ isDrawerOpen, setIsDrawerOpen }) {
  const iconCss = "text-gray-500 group-hover:text-blue-600";

  return (
    <>
      <BottomBar isDrawerOpen={isDrawerOpen}>
        <BottomBarItem
          icon={<FaHome size={25} className={iconCss} />}
          text={"Home"}
          to={"/admin"}
        />
        <BottomBarItem
          to={"requests"}
          text={"Search"}
          icon={<FaSearch className={iconCss} size={25} />}
        />
        <BottomBarItem
          to={"/"}
          text={"Committees"}
          icon={<FaUserGroup className={iconCss} size={25} />}
        />
        <BottomBarButton iconCss={iconCss} setIsDrawerOpen={setIsDrawerOpen} />
      </BottomBar>
    </>
  );
}

import React from "react";
import BottomBar from "../../../Components/Layout/mobile/BottomBar/BottomBar";
import BottomBarItem from "../../../Components/Layout/mobile/BottomBar/BottomBarItem";
import { FaHome, FaSearch } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import BottomBarButton from "../../../Components/Layout/mobile/BottomBar/BottomBarButton";
import { Home } from "lucide-react";
import { MdEvent } from "react-icons/md";

export default function BottomBarComponent({ isDrawerOpen, setIsDrawerOpen }) {
  const iconCss = "text-gray-500 group-hover:text-blue-600";

  return (
    <BottomBar isDrawerOpen={isDrawerOpen}>
      <BottomBarItem
        icon={<Home className={iconCss} size={20} />}
        text={"Home"}
        to={"/teacher"}
      />
      <BottomBarItem
        icon={<MdEvent className={iconCss} size={20} />}
        text={"Events"}
        to={"/teacher/events"}
      />
      <BottomBarItem
        icon={<FaUserGroup className={iconCss} size={20} />}
        text={"Explore"}
        to={"/teacher/explore"}
      />
      <BottomBarButton iconCss={iconCss} setIsDrawerOpen={setIsDrawerOpen} />
    </BottomBar>
  );
}

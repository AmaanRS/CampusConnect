import React, { useContext } from "react";
import { FiLogOut } from "react-icons/fi";
import {
  HiChartPie,
  HiClipboard,
  HiCollection,
  HiInformationCircle,
  HiLogin,
  HiPencil,
  HiShoppingBag,
  HiUsers,
} from "react-icons/hi";
import { UserContext } from "../../../store/UserContextProvider";
import { Sidebar } from "flowbite-react";
import { NavLink, useLocation } from "react-router-dom";

export default function MobileSidebarComponent({ setIsDrawerOpen }) {
  const { logOutUser } = useContext(UserContext);
  const { pathname } = useLocation();
  const currntPage = pathname.split("/").pop();

  function getStyle(path) {
    const sidebarItemStyle =
      "transition-colors group focus:bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800 ";
    const activeStyling =
      "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800";
    const finalStyle =
      sidebarItemStyle + `${currntPage === path ? activeStyling : ""}`;
    return finalStyle;
  }

  const handleClose = () => setIsDrawerOpen(false);

  return (
    <Sidebar.Items>
      <Sidebar.ItemGroup>
        <Sidebar.Item
          className={getStyle("teacher")}
          as={NavLink}
          to="/teacher"
          icon={HiChartPie}
          onClick={() => handleClose()}
        >
          Dashboard
        </Sidebar.Item>
        <Sidebar.Item
          as={NavLink}
          className={getStyle("createcommittee")}
          to="createcommittee"
          icon={HiUsers}
          onClick={() => handleClose()}
        >
          Create Committee
        </Sidebar.Item>
        <Sidebar.Item icon={HiShoppingBag}>Users list</Sidebar.Item>
        <Sidebar.Item icon={HiLogin}>Sign in</Sidebar.Item>
        <Sidebar.Item icon={HiPencil}>Sign up</Sidebar.Item>
      </Sidebar.ItemGroup>
      <Sidebar.ItemGroup>
        <Sidebar.Item icon={HiClipboard}>Docs</Sidebar.Item>
        <Sidebar.Item icon={HiCollection}>Components</Sidebar.Item>
        <Sidebar.Item icon={HiInformationCircle}>Help</Sidebar.Item>
        <Sidebar.Item onClick={() => logOutUser()} icon={FiLogOut}>
          Logout
        </Sidebar.Item>
      </Sidebar.ItemGroup>
    </Sidebar.Items>
  );
}

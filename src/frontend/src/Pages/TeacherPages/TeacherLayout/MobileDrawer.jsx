/* eslint-disable react/prop-types */
"use client";

import { Drawer, Sidebar } from "flowbite-react";
import { useContext } from "react";
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
import { NavLink, useLocation } from "react-router-dom";
import { UserContext } from "../../../store/UserContextProvider";

export default function MobileDrawer({ isDrawerOpen, setIsDrawerOpen }) {
  const { pathname } = useLocation();
  const currntPage = pathname.split("/").pop();
  const { logOutUser } = useContext(UserContext);
  const handleClose = () => setIsDrawerOpen(false);

  function getStyle(path) {
    const sidebarItemStyle =
      "transition-colors group focus:bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800 ";
    const activeStyling =
      "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800";
    const finalStyle =
      sidebarItemStyle + `${currntPage === path ? activeStyling : ""}`;
    return finalStyle;
  }
  return (
    <>
      <Drawer open={isDrawerOpen} onClose={handleClose}>
        <Drawer.Header title="MENU" titleIcon={() => <></>} />
        <Drawer.Items>
          <Sidebar
            aria-label="Sidebar with multi-level dropdown example"
            className="[&>div]:bg-transparent [&>div]:p-0"
          >
            <div className="flex h-full flex-col justify-between py-2">
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
            </div>
          </Sidebar>
        </Drawer.Items>
      </Drawer>
    </>
  );
}

/* eslint-disable react/prop-types */
"use client";

import { Button, Drawer, Sidebar, TextInput } from "flowbite-react";
import {
  HiChartPie,
  HiClipboard,
  HiCollection,
  HiInformationCircle,
  HiLogin,
  HiPencil,
  HiSearch,
  HiShoppingBag,
  HiUsers,
} from "react-icons/hi";
import { NavLink } from "react-router-dom";

export default function MobileDrawer({ isDrawerOpen, setIsDrawerOpen }) {
  const handleClose = () => setIsDrawerOpen(false);
  const sidebarItemStyle =
    "transition-colors group focus:bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800";

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
              <div>
                <form className="pb-3 md:hidden">
                  <TextInput
                    icon={HiSearch}
                    type="search"
                    placeholder="Search"
                    required
                    size={32}
                  />
                </form>
                <Sidebar.Items>
                  <Sidebar.ItemGroup>
                    <Sidebar.Item
                      className={sidebarItemStyle}
                      as={NavLink}
                      to="/teacher"
                      icon={HiChartPie}
                      onClick={() => handleClose()}
                    >
                      Dashboard
                    </Sidebar.Item>
                    <Sidebar.Item
                      as={NavLink}
                      className={sidebarItemStyle}
                      to="createcommittee"
                      icon={HiUsers}
                      onClick={() => handleClose()}
                    >
                      Create Committee
                    </Sidebar.Item>
                    <Sidebar.Item
                      className={sidebarItemStyle}
                      icon={HiShoppingBag}
                    >
                      Users list
                    </Sidebar.Item>
                    <Sidebar.Item className={sidebarItemStyle} icon={HiLogin}>
                      Sign in
                    </Sidebar.Item>
                    <Sidebar.Item className={sidebarItemStyle} icon={HiPencil}>
                      Sign up
                    </Sidebar.Item>
                  </Sidebar.ItemGroup>
                  <Sidebar.ItemGroup>
                    <Sidebar.Item icon={HiClipboard}>Docs</Sidebar.Item>
                    <Sidebar.Item icon={HiCollection}>Components</Sidebar.Item>
                    <Sidebar.Item icon={HiInformationCircle}>Help</Sidebar.Item>
                  </Sidebar.ItemGroup>
                </Sidebar.Items>
              </div>
            </div>
          </Sidebar>
        </Drawer.Items>
      </Drawer>
    </>
  );
}

/* eslint-disable react/prop-types */
"use client";

import { Drawer, Sidebar, TextInput } from "flowbite-react";
import { FiLogOut } from "react-icons/fi";
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
import { UserContext } from "../../../store/UserContextProvider";
import { useContext } from "react";

export default function MobileDrawer({ isDrawerOpen, setIsDrawerOpen }) {
  const { logOutUser } = useContext(UserContext);
  const handleClose = () => setIsDrawerOpen(false);

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
                    <Sidebar.Item href="" icon={HiChartPie}>
                      Dashboard
                    </Sidebar.Item>
                    <Sidebar.Item href="/" icon={HiShoppingBag}>
                      Products
                    </Sidebar.Item>
                    <Sidebar.Item href="/" icon={HiUsers}>
                      Users list
                    </Sidebar.Item>
                    <Sidebar.Item href="/" icon={HiLogin}>
                      Sign in
                    </Sidebar.Item>
                    <Sidebar.Item href="" icon={HiPencil}>
                      Sign up
                    </Sidebar.Item>
                  </Sidebar.ItemGroup>
                  <Sidebar.ItemGroup>
                    <Sidebar.Item href="" icon={HiClipboard}>
                      Docs
                    </Sidebar.Item>
                    <Sidebar.Item href="" icon={HiCollection}>
                      Components
                    </Sidebar.Item>
                    <Sidebar.Item href="" icon={HiInformationCircle}>
                      Help
                    </Sidebar.Item>
                    <Sidebar.Item onClick={() => logOutUser()} icon={FiLogOut}>
                      Logout
                    </Sidebar.Item>
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

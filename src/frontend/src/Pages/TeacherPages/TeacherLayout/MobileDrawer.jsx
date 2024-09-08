/* eslint-disable react/prop-types */
"use client";

import { Drawer, Sidebar } from "flowbite-react";

export default function MobileDrawer({
  isDrawerOpen,
  setIsDrawerOpen,
  children,
}) {
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
              {children}
            </div>
          </Sidebar>
        </Drawer.Items>
      </Drawer>
    </>
  );
}

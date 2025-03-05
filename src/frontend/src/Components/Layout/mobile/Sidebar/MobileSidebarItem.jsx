import { Sidebar } from "flowbite-react";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function MobileSidebarItem({
  setIsDrawerOpen,
  to,
  icon,
  children,
  routeName,
}) {
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
    <Sidebar.Item
      className={getStyle(routeName)}
      as={NavLink}
      to={to}
      icon={icon}
      onClick={() => handleClose()}
    >
      {children}
    </Sidebar.Item>
  );
}

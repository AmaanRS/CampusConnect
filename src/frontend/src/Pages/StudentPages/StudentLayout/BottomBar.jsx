/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaHome, FaSearch } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import MobileDrawer from "./MobileDrawer";
import { HiAdjustments } from "react-icons/hi";

export default function BottomBar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const iconCss = "text-gray-500 group-hover:text-blue-600";

  return (
    <>
      <div
        className={`${
          isDrawerOpen ? "hidden" : "fixed"
        } sm:hidden  z-50 w-full h-16 max-w-lg -translate-x-1/2 bg-white border border-gray-200 rounded-full bottom-4 left-1/2 dark:bg-gray-700 dark:border-gray-600`}
      >
        <div className="grid h-full max-w-lg grid-cols-4 mx-auto">
          {/* button 1 */}
          <BottomBarItem
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

          <button
            onClick={() => setIsDrawerOpen(true)}
            data-tooltip-target="tooltip-profile"
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 rounded-e-full hover:bg-gray-50 dark:hover:bg-gray-800 group"
          >
            <HiAdjustments className={iconCss} size={25} />
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
              More
            </span>
          </button>
        </div>
      </div>
      <MobileDrawer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      />
    </>
  );
}

function BottomBarItem({ icon, text }) {
  return (
    <button
      type="button"
      className="inline-flex flex-col items-center justify-center px-5 rounded-s-full hover:bg-gray-50 dark:hover:bg-gray-800 group"
    >
      {icon}
      <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
        {text}
      </span>
    </button>
  );
}

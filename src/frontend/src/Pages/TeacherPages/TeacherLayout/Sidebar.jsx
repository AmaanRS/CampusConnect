/* eslint-disable react/prop-types */
import { ChevronFirst, ChevronLast } from "lucide-react";
import { createContext, useContext } from "react";
import { NavLink } from "react-router-dom";

export const SidebarContext = createContext();

export default function Sidebar({ children, setGlobalOpen, globalOpen }) {
  return (
    <>
      <div className="hidden sm:flex fixed left-0 top-0">
        <aside className="h-screen">
          <nav className="h-full flex flex-col bg-white border-r shadow-sm">
            <div className="p-4 pb-2 flex justify-between items-center">
              <Logo globalOpen={globalOpen} />
              <button
                onClick={() => {
                  setGlobalOpen((curr) => !curr);
                }}
                className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
              >
                {globalOpen ? <ChevronFirst /> : <ChevronLast />}
              </button>
            </div>

            <SidebarContext.Provider value={{ globalOpen }}>
              <ul className="flex-1 px-3">{children}</ul>
            </SidebarContext.Provider>

            {/* <div className="border-t flex p-3">
            <img className="w-10 h-10 rounded-md" />
            <div
              className={`flex justify-between items-center overflow-hidden transition-all ${
                globalOpen ? "w-52 ml-3" : "w-0"
              } `}
            >
              <div className="leading-4">
                <h4 className="font-semibold">constGenius</h4>
                <span className="text-xs text-gray-600">
                  constgenius@gmail.com
                </span>
              </div>
              <MoreVertical size={20} />
            </div>
          </div> */}
          </nav>
        </aside>
      </div>
    </>
  );
}

function Logo({ globalOpen }) {
  return (
    <div className="logo ">
      <h1
        className={` overflow-hidden transition-all ${
          globalOpen ? "w-36" : "w-0"
        } tracking-tighter text-lg font-semibold text-blue-dark`}
      >
        Campus<span className="text-blue-light">Connect</span>
      </h1>
    </div>
  );
}

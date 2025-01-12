/* eslint-disable react/prop-types */

export default function Sidebar({ children }) {
  return (
    <>
      {/* <div className="hidden sm:flex fixed left-0 top-0 w-72"> */}
      <div className="border-2 border-black col-span-3 hidden sm:block ">
        <aside className="h-screen">
          <nav className="h-full flex flex-col bg-white border-r shadow-sm">
            <div className="p-4 pb-2 flex justify-between items-center">
              <Logo />
            </div>

            <ul className="flex-1 px-3">{children}</ul>

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

function Logo() {
  return (
    <div className="logo ">
      <h1
        className={` overflow-hidden transition-all "w-36"  tracking-tighter text-lg font-semibold text-blue-dark`}
      >
        Campus<span className="text-blue-light">Connect</span>
      </h1>
    </div>
  );
}

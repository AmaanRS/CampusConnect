export default function SidebarButton({ icon, text, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative w-full flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group hover:bg-indigo-50 text-gray-600`}
    >
      {icon}
      {/* <span className="ml-2">{text}</span> */}
      <span className={`ml-2 overflow-hidden `}>{text}</span>
    </button>
  );
}

import { NavLink } from "react-router-dom";

export default function BottomBarItem({ icon, text, to }) {
  return (
    <NavLink
      to={to}
      className="inline-flex flex-col items-center rounded-s-full justify-center px-5  hover:bg-gray-50 dark:hover:bg-gray-800 group"
    >
      {icon}
      <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
        {text}
      </span>
    </NavLink>
  );
}

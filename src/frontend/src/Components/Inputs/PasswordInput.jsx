import { useState } from "react";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";

export default function PasswordInput({ register, name }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function togglePasswordVisibility() {
    setIsPasswordVisible((prevState) => !prevState);
  }

  return (
    <div className="relative  container  ">
      <input
        type={isPasswordVisible ? "text" : "password"}
        placeholder="Password"
        className="w-full  text-base    outline-none focus:ring-blue-500 focus:border-blue-500 focus:ring-1 rounded-md px-3 py-1 md:py-2 border-[1px] border-blue-dark xl:text-xl text-blue-light  "
        {...register(name)}
      />

      <button
        type="button"
        className="absolute inset-y-0 right-0 flex items-center px-4 "
        onClick={togglePasswordVisibility}
      >
        {isPasswordVisible ? (
          <MdOutlineVisibility size={20} className="text-blue-dark" />
        ) : (
          <MdOutlineVisibilityOff size={20} className="text-blue-dark" />
        )}
      </button>
    </div>
  );
}

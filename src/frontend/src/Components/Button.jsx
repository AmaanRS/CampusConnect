/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

function Button({
  color,
  name,
  textcolor,
  border,
  hover,
  paddingx,
  textsm,
  sm,
}) {
  return (
    <button
      className={` px-10 py-2 ${color} ${textcolor} ${border} hover:${hover} transition-all transform  rounded-lg font-semibold ${paddingx}
      ${textsm} sm:px-${sm} 
      `}
    >
      {name}
    </button>
  );
}

export default Button;

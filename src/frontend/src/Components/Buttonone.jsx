/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

function Buttonone({ name, textlg = "text-3xl" }) {
  return (
    <button
      className={`px-8 py-2 bg-blue-dark text-white rounded-lg font-semibold 
        lg:text-xl lg:px-10 lg:py-3`}
    >
      {name}
    </button>
  );
}

export default Buttonone;

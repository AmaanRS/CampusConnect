/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

function Buttonborder({ name }) {
  return (
    <button
      className="px-6 py-2 border border-blue-dark text-blue-dark rounded-lg font-semibold
    lg:text-xl lg:px-10 lg:py-3"
    >
      {name}
    </button>
  );
}

export default Buttonborder;

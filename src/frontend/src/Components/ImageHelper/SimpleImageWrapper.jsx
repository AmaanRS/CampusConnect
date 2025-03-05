import React from "react";

export default function SimpleImageWrapper({ children, image }) {
  return (
    <div
      style={{
        backgroundImage: `url(${image})`,
      }}
      className="h-screen w-screen bg-cover bg-center  z-[51] fixed top-0 left-0"
    >
      {children}
    </div>
  );
}

import React from "react";

export default function CentreMainContent({ children }) {
  return (
    <div className="md:mr-72">
      <div className="max-w-2xl m-auto">{children}</div>
    </div>
  );
}

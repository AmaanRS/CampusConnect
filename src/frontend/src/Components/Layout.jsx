/* eslint-disable no-unused-vars */
import React from "react";
import Sectioneven from "./Sectioneven";
import Sectionodd from "./Sectionodd";
import Mainsection from "./Mainsection";
import Footer from "./Footer";

function Layout() {
  return (
    <>
      <div className="h-full">
        <Mainsection />
      </div>
      <div className="flex justify-center items-center flex-col m-5 h-full">
        <Sectionodd val={true} />
        <Sectioneven val={true} />
        <Sectionodd val={false} />
        <Sectioneven val={false} />
      </div>
      <Footer />
    </>
  );
}

export default Layout;

/* eslint-disable no-unused-vars */
import React from "react";
import LocomotiveScroll from "locomotive-scroll";
import Nav from "./Components/Nav";
import { BrowserRouter } from "react-router-dom";
import Routing from "./utils/Routing";

function App() {
  const locomotiveScroll = new LocomotiveScroll();

  return (
    <div className=" bg-blue-extralight w-full font-openSans overflow-x-hidden">
      <BrowserRouter>
        <Nav />

        <Routing />
      </BrowserRouter>
    </div>
  );
}

export default App;

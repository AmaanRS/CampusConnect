/* eslint-disable no-unused-vars */
import React from "react";
import LocomotiveScroll from "locomotive-scroll";
import Nav from "./Components/Nav";
import Mainsection from "./Components/Mainsection";
import Buttonone from "./Components/Buttonone";
import Buttonborder from "./Components/Buttonborder";

function App() {
  const locomotiveScroll = new LocomotiveScroll();

  return (
    <div className=" bg-blue-extralight w-full h-screen ">
      <Nav />
      <Mainsection />
    </div>
  );
}

export default App;

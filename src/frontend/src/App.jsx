/* eslint-disable no-unused-vars */
import React from "react";
import LocomotiveScroll from "locomotive-scroll";
import Nav from "./Components/Nav";
import Routing from "./utils/Routing";
import { useLocation } from "react-router-dom";

function App() {
  const locomotiveScroll = new LocomotiveScroll();

  return (
    <div className=" bg-blue-extralight w-full font-openSans overflow-x-hidden">
      <ConditionalNav />
      <Routing />
    </div>
  );
}

function ConditionalNav() {
  const location = useLocation();
  const hideNavPaths = ["/login", "/signup", "/dashboard"];

  return !hideNavPaths.includes(location.pathname) ? <Nav /> : null;
}

export default App;

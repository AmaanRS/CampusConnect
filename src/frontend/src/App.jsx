/* eslint-disable no-unused-vars */
import React from "react";
import LocomotiveScroll from "locomotive-scroll";
import Nav from "./Components/Landing Page/Nav";
// import Routing from "./utils/Routes/Routing";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import About from "./Components/Landing Page/About";
import Contact from "./Components/Landing Page/Contact";
import Login, { loginLoader } from "./Components/Auth & Authorization/Login";
import Signup, { SignupLoader } from "./Components/Auth & Authorization/Signup";
import Dashboard from "./Components/Landing Page/Dashboard";
import Layout from "./Components/Landing Page/Layout";
import ErrorPage from "./utils/Alerts & animations/ErrorPage";

function App() {
  const locomotiveScroll = new LocomotiveScroll();
  const router = createBrowserRouter([
    {
      path: "/",
      // errorElement:<ErrorPage />,
      // action: homeAction,
      children: [
        {
          index: true,
          element: <Layout />,
          // action: homeAction,
          // loader: homeLoader,
        },
        // {
        //   // path: "main",
        //   // element: <MainPage />,
        //   // loader: mainLoader,
        // },
        {
          path: "about",
          element: <About />,
        },
        {
          path: "contact",
          element: <Contact />,
        },
        {
          path: "login",
          element: <Login />,
          loader: loginLoader,
        },
        {
          path: "signup",
          element: <Signup />,
          loader: SignupLoader,
        },
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "error",
          element: <ErrorPage />,
        },
      ],
    },
  ]);

  return (
    <div className=" bg-blue-extralight w-full font-openSans overflow-x-hidden">
      {/* <ConditionalNav /> */}

      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;

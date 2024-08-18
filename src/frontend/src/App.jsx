/* eslint-disable no-unused-vars */
import React from "react";
import LocomotiveScroll from "locomotive-scroll";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import About from "./Components/Landing Page/About";
import Contact from "./Components/Landing Page/Contact";
import Login, { loginLoader } from "./Components/Auth & Authorization/Login";
import Signup, { SignupLoader } from "./Components/Auth & Authorization/Signup";
import Layout from "./Components/Landing Page/Layout";
import ErrorPage from "./utils/Alerts & animations/ErrorPage";
import UserProfile from "./Components/User Profile/UserProfile";
import ProfileCompleted from "./Components/User Profile/ProfileCompleted";
import Dashboard, { dashboardLoader } from "./Components/Dashboard/Dashboard";
import {
  AuthContext,
  AuthProvider,
} from "./Components/Auth & Authorization/AuthContext";

function App() {
  const locomotiveScroll = new LocomotiveScroll();
  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <ErrorPage />,
      // action: homeAction,
      children: [
        {
          index: true,
          element: <Layout />,
          // action: homeAction,
          // loader: homeLoader,
        },
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
          path: "userprofile",
          element: <UserProfile />,
          // children: [
          //   {
          //     path: "completed",
          //     element: <ProfileCompleted />,
          //   },
          // ],
        },
        // {
        //   path: "completed",
        //   element: <ProfileCompleted />,
        // },
        {
          path: "dashboard",
          element: <Dashboard />,
          loader: dashboardLoader,
        },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <div className="bg-blue-extralight w-full font-openSans overflow-x-hidden h-full">
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  );
}

export default App;

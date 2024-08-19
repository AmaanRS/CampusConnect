/* eslint-disable no-unused-vars */
import React from "react";
import LocomotiveScroll from "locomotive-scroll";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import About from "./Pages/Landing Page/About";

import Contact from "./Pages/Landing Page/Contact";
import Login, { loginLoader } from "./Components/Auth & Authorization/Login";
import Signup, { SignupLoader } from "./Components/Auth & Authorization/Signup";
import Layout from "./Pages/Landing Page/Layout";
import ErrorPage from "./utils/Alerts & animations/ErrorPage";
import UserProfile from "./Components/User Profile/UserProfile";
import ProfileCompleted from "./Components/User Profile/ProfileCompleted";
// import Dashboard, { dashboardLoader } from "./Components/Dashboard/Dashboard";

import {
  AuthContext,
  AuthProvider,
} from "./Components/Auth & Authorization/AuthContext";
// import MainProfile from "./Components/Dashboard/MainProfile";
// import SearchProfile from "./Components/Dashboard/SearchProfile";
// import Home from "./Components/Dashboard/Home";
import ProtectedRoutes from "./Components/Auth & Authorization/ProtectedRoutes";
import AdminLayout from "./Pages/Admin/AdminLayout/AdminLayout";
import Dashboard from "./Pages/Admin/Dashboard/Dashboard";

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
          path: "/u",
          element: <ProtectedRoutes />,
          children: [
            {
              path: "admin",
              element: <AdminLayout />,
              children: [
                {
                  path: "dashboard",
                  element: <Dashboard />,
                },
              ],
            },
          ],
        },
        // {
        //   path: "dashboard",
        //   element: <Dashboard />,
        //   loader: dashboardLoader,
        //   children: [
        //     { path: "home", element: <Home /> },
        //     { path: "userprof", element: <MainProfile /> },
        //     { path: "searchprof", element: <SearchProfile /> },
        //   ],
        // },
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

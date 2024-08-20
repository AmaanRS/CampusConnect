/* eslint-disable no-unused-vars */
import React from "react";
import LocomotiveScroll from "locomotive-scroll";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import About from "./Pages/Landing Page/About";

import Contact from "./Pages/Landing Page/Contact";
import Layout from "./Pages/Landing Page/Layout";
import UserProfile from "./Components/User Profile/UserProfile";
import ProfileCompleted from "./Components/User Profile/ProfileCompleted";
// import Dashboard, { dashboardLoader } from "./Components/Dashboard/Dashboard";

// import MainProfile from "./Components/Dashboard/MainProfile";
// import SearchProfile from "./Components/Dashboard/SearchProfile";
// import Home from "./Components/Dashboard/Home";
import AdminLayout from "./Pages/Admin/AdminLayout/AdminLayout";
import Dashboard from "./Pages/Admin/Dashboard/Dashboard";
import ErrorPage from "./Components/Alerts & animations/ErrorPage";
import Login from "./Pages/Auth & Authorization/Login";
import Signup from "./Pages/Auth & Authorization/Signup";
import ProtectedRoutes from "./Pages/Auth & Authorization/ProtectedRoutes";
import { UserContextProvider } from "./store/UserContextProvider";

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
        },
        {
          path: "signup",
          element: <Signup />,
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
    <UserContextProvider>
      <div className="bg-blue-extralight w-full font-openSans overflow-x-hidden h-full">
        <RouterProvider router={router} />
      </div>
    </UserContextProvider>
  );
}

export default App;

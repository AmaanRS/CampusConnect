/* eslint-disable no-unused-vars */
import React from "react";
import LocomotiveScroll from "locomotive-scroll";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import About from "./Pages/Landing Page/About";
import { ToastContainer } from "react-toastify";
import Contact from "./Pages/Landing Page/Contact";
import Layout from "./Pages/Landing Page/Layout";
import UserProfile from "./Components/User Profile/UserProfile";
import ProfileCompleted from "./Components/User Profile/ProfileCompleted";
import AdminLayout from "./Pages/AdminPages/AdminLayout/AdminLayout";
import Dashboard from "./Pages/AdminPages/Dashboard/Dashboard";
import ErrorPage from "./Components/Alerts & animations/ErrorPage";
import Login from "./Pages/Auth/Login";
import Signup from "./Pages/Auth/Signup";
import ProtectedRoutes from "./Pages/Auth/ProtectedRoutes";
import { UserContextProvider } from "./store/UserContextProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import StudentLayout from "./Pages/StudentPages/StudentLayout/StudentLayout";
import TeacherLayout from "./Pages/TeacherPages/TeacherLayout/TeacherLayout";
import CreateCommittee from "./Pages/TeacherPages/CreateCommittee/CreateCommittee";
import TeacherDashboard from "./Pages/TeacherPages/Dashboard/TeacherDashboard";

const queryClient = new QueryClient();
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
                  index: true,
                  element: <Dashboard />,
                },
                {
                  path: "requests",
                  element: <div>Hello</div>,
                },
              ],
            },
            {
              path: "student",
              element: <StudentLayout />,
            },
            {
              path: "teacher",
              element: <TeacherLayout />,
              children: [
                { index: true, element: <TeacherDashboard /> },
                {
                  path: "createcommittee",
                  element: <CreateCommittee />,
                },
              ],
            },
          ],
        },
      ],
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <div className="bg-blue-extralight w-full font-openSans overflow-x-hidden h-full">
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover={false}
            theme="light"
          />
          <RouterProvider router={router} />
        </div>
      </UserContextProvider>
    </QueryClientProvider>
  );
}

export default App;

/* eslint-disable no-unused-vars */
import "./CardScroll.css";
import "./Components/RichTextEditor/styles.scss";
import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import About from "./Pages/Landing Page/About";
import { ToastContainer } from "react-toastify";
import Contact from "./Pages/Landing Page/Contact";
import Layout from "./Pages/Landing Page/Layout";
import UserProfile from "./Components/User Profile/UserProfile";
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
import TeacherDashboard from "./Pages/TeacherPages/Dashboard/TeacherDashboard";
import AppLayout from "./Components/Layout/AppLayout";
import CreateCommittee from "./Pages/AdminPages/CreateCommittee/CreateCommittee";
import AllCommittees from "./Pages/AdminPages/AllCommittees/AllCommittees";
import AllTeachers from "./Pages/AdminPages/Teachers/AllTeachers";
import AllStudents from "./Pages/AdminPages/Students/AllStudents";
import TestLayout from "./Test/TestLayout";
import AddPost from "./Pages/StudentPages/AddPost/AddPost";
import StudentHomeLayout from "./Pages/StudentPages/Home/StudentHomeLayout";
import PostDetailsLayout from "./Pages/StudentPages/PostDetails/PostDetailsLayout";
import CommitteeDetailLayout from "./Pages/StudentPages/CommitteeDetails/CommitteeDetailLayout";
import Explore from "./Pages/StudentPages/Explore/Explore";
import AddEvent from "./Pages/StudentPages/AddEvent/AddEvent";
import AllEvents from "./Pages/StudentPages/AllEvents/AllEvents";
import AllEventsLayout from "./Pages/StudentPages/AllEvents/AllEventsLayout";
import PreLoader from "./PreLoader";
import EventUpdateForm from "./Pages/StudentPages/AllEvents/EventUpdateForm";

const queryClient = new QueryClient();

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading process (e.g., fetching data, assets, etc.)
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false); // Set loading to false after 2 seconds (or when your data is ready)
    }, 2000);
  }, []);

  if (isLoading) {
    return <PreLoader />;
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Layout />,
        },
        {
          path: "test",
          element: <TestLayout />,
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
        },
        {
          element: <ProtectedRoutes />,
          children: [
            {
              path: "admin",
              element: <AdminLayout />,
              children: [
                { index: true, element: <Dashboard /> },
                { path: "allCommittee", element: <AllCommittees /> },
                { path: "createcommittee", element: <CreateCommittee /> },
                { path: "teachers", element: <AllTeachers /> },
                { path: "students", element: <AllStudents /> },
              ],
            },
            {
              path: "student",
              element: <StudentLayout />,
              children: [
                { index: true, element: <StudentHomeLayout /> },
                { path: "createPost", element: <AddPost /> },
                { path: "createEvent", element: <AddEvent /> },
                { path: "explore", element: <Explore /> },
                { path: "post/:postId", element: <PostDetailsLayout /> },
                { path: "edit/event/:eventId", element: <EventUpdateForm /> },
                {
                  path: "committee/:committeeId",
                  element: <CommitteeDetailLayout />,
                },
                { path: "events", element: <AllEventsLayout /> },
              ],
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
            pauseOnFocusLoss={false}
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

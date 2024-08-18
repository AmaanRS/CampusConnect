/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../Axios/AxiosInstance";
import { jwtDecode } from "jwt-decode";
import Cookie from "js-cookie";
// Create the context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accType, setAccType] = useState(null);
  const [profCompleted, setProfCompleted] = useState(false); // Dsiplays profile completion page for userprofile

  const token = Cookie.get("token");
  // console.log(token, "jwt");

  console.log(profCompleted);

  // setTimeout(() => {
  //   setProfCompleted(false);
  // }, 3000);

  if (token) {
    const decodedToken = jwtDecode(token);
    // console.log(decodedToken);
  }

  // Load user data from local storage when the component mounts
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Save user data to local storage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Getting the profile status of the user

  async function getProfileStatus() {
    const res = await axiosInstance.post("/getUserProfileStatus");
    console.log(res);
    let accountType = res.data.data.accType;
    console.log(accType);
    setAccType(accountType);
  }

  useEffect(() => {
    getProfileStatus();
  });

  return (
    <AuthContext.Provider
      value={{ user, setUser, accType, profCompleted, setProfCompleted }}
    >
      {children}
    </AuthContext.Provider>
  );
};

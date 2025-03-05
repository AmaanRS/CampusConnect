/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { createContext, useEffect, useReducer } from "react";
import Cookies from "js-cookie";
import { getToken } from "../utils/getToken";

const initialState = {
  email: "",
  position: [],
  accountType: "",
  iat: 0,
  isProfileComplete: "",
  isAccountActive: "",
};

function getInitialState() {
  const res = JSON.parse(localStorage.getItem("user")) || initialState;
  return res;
}

export const UserContext = createContext({
  userState: initialState,
  setUserState: () => {},
  logOutUser: () => {},
});

const reducer = (state, action) => {
  const type = action.type;
  switch (type) {
    case "setUserState": {
      const newState = action.payload;
      return newState;
    }
    case "logOutUser": {
      localStorage.removeItem("user");
      Cookies.remove("token");
      return initialState;
    }

    default:
      return state;
  }
};

export const UserContextProvider = ({ children }) => {
  const [userState, dispatch] = useReducer(reducer, getInitialState());
  console.log(userState, getToken().isLoggedIn);
  const { token } = getToken();

  useEffect(() => {
    if (!token || userState.email === "") {
      logOutUser();
    }
  }, []);

  useEffect(() => {
    if (userState) {
      localStorage.setItem("user", JSON.stringify(userState));
    }
  }, [userState]);

  function setUserState(user) {
    dispatch({
      type: "setUserState",
      payload: user,
    });
  }

  function logOutUser() {
    dispatch({
      type: "logOutUser",
    });
  }
  const value = { userState, setUserState, logOutUser };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

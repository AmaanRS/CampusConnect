/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { createContext, useContext, useEffect, useReducer } from "react";

const initialState = {
  email: "",
  position: [],
  accountType: "",
  iat: 0,
};

export const UserContext = createContext({
  userState: initialState,
  setUserState: () => {},
  deleteUserState: () => {},
});

const reducer = (state, action) => {
  const type = action.type;
  switch (type) {
    case "setUserState": {
      const newState = action.payload;
      return newState;
    }
    case "deleteUserState": {
      localStorage.removeItem("user");
      return null;
    }

    default:
      return state;
  }
};

export const UserContextProvider = ({ children }) => {
  const [userState, dispatch] = useReducer(reducer, null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUserState(savedUser);
    }
  }, []);

  useEffect(() => {
    if (userState) {
      localStorage.setItem("user", JSON.stringify(userState));
    }
  }, [userState]);

  function setUserState(user) {
    console.log("inside dispatch", user);
    dispatch({
      type: "setUserState",
      payload: user,
    });
  }

  function deleteUserState() {
    dispatch({
      type: "deleteUserState",
    });
  }

  const value = { userState, setUserState, deleteUserState };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

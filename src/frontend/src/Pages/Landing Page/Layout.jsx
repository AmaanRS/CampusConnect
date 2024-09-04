/* eslint-disable no-unused-vars */
import React, { useContext, useEffect } from "react";
import Sectioneven from "./Sectioneven";
import Sectionodd from "./Sectionodd";
import Mainsection from "./Mainsection";
import Footer from "./Footer";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../store/UserContextProvider";
import { getToken } from "../../utils/getToken";
import { AccountType } from "../../utils/enum";

function Layout() {
  const navigate = useNavigate();
  const { userState } = useContext(UserContext);
  const { isLoggedIn } = getToken();
  useEffect(() => {
    if (isLoggedIn) {
      if (userState.accountType === AccountType.Admin) {
        navigate("/admin");
      }
      if (userState.accountType === AccountType.Teacher) {
        navigate("/teacher");
      }
      if (userState.accountType === AccountType.Student) {
        navigate("/student");
      }
    }
  });
  return (
    <>
      <div className="h-full">
        <Nav />
        <Mainsection />
      </div>
      <div className="flex justify-center items-center flex-col m-5 h-full">
        <Sectionodd val={true} />
        <Sectioneven val={true} />
        <Sectionodd val={false} />
        <Sectioneven val={false} />
      </div>
      <Footer />
    </>
  );
}

export default Layout;

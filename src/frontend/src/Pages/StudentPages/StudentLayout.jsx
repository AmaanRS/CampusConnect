import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../store/UserContextProvider";
import { AccountType } from "../../utils/enum";

export default function StudentLayout() {
  const { userState } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (userState.accountType !== AccountType.Student) {
      navigate("/");
    }
  });
  return <div>StudentLayout</div>;
}

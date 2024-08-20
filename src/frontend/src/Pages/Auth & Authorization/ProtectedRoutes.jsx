import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
// import { AuthContext } from "./AuthContext";
import { getToken } from "../../utils/getToken";
import { UserContext } from "../../store/UserContextProvider";
import { AccountType } from "../../utils/enum";

export default function ProtectedRoutes() {
  const navigate = useNavigate();
  const { userState } = useContext(UserContext);
  // use this componet for redirecting unauthenticated users
  const { isLoggedIn } = getToken();
  useEffect(() => {
    if (!isLoggedIn) {
      return navigate("/", { replace: false });
    }
    if (userState.accountType === AccountType.Admin) {
      navigate("/u/admin/dashboard");
    }
  }, [isLoggedIn, userState]);

  return (
    <>
      <Outlet />
    </>
  );
}

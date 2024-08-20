import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
// import { AuthContext } from "./AuthContext";
import { getToken } from "../../utils/getToken";
import { UserContext } from "../../store/UserContextProvider";

export default function ProtectedRoutes() {
  const navigate = useNavigate();
  const { userState } = useContext(UserContext);
  // use this componet for redirecting unauthenticated users
  const { isLoggedIn } = getToken();
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/", { replace: false });
    }
  }, [isLoggedIn, userState]);

  return (
    <>
      <Outlet />
    </>
  );
}

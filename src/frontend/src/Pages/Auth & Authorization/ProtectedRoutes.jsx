import { useEffect } from "react";
import { Outlet } from "react-router-dom";
// import { AuthContext } from "./AuthContext";
import Cookie from "js-cookie";

export default function ProtectedRoutes() {
  // const { user } = useContext(AuthContext);
  const isLoggedIn = Cookie.get("token");
  // const navigate = useNavigate();

  // use this componet for redirecting unauthenticated users
  useEffect(() => {
    // if (!isLoggedIn) {
    //   return navigate("/", { replace: false });
    // }
  }, [isLoggedIn]);

  return (
    <>
      <Outlet />
    </>
  );
}

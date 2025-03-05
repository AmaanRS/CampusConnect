import Cookies from "js-cookie";
export const getToken = () => {
  const token = Cookies.get("token");
  let isLoggedIn = false;
  if (token) {
    isLoggedIn = true;
  }
  return { isLoggedIn, token };
};

import { useParams } from "react-router-dom"
import { setCookie } from "../utils/authUtils"
import axios from "axios"

export default function RedirectPage() {

  //add this jwt to the cookie
  const {token} = useParams<string>()
  // setCookie(token)

  const logou = async ()=>{
    const res = await axios.get("http://localhost:8000/auth/logout")
    console.log(res)
  }

  return (
    <>
    Redirected here
    {token}
    <button onClick={logou}>Logout</button>
    </>
  )
}

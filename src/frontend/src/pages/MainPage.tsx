import { useParams } from "react-router-dom"

export default function MainPage() {

  //add this jwt to the cookie
  const {token} = useParams()
  return (
    <>
    Redirected here
    {token}
    </>
  )
}

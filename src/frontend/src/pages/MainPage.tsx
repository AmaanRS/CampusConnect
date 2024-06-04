import { useLoaderData, useNavigate } from "react-router-dom"
import { LoaderResponse } from "../../FrontendTypes"
import { getCookie } from "../utils/authUtils"
import { MainComponent } from "../components/MainComponent"
import { useEffect } from "react"

export default function MainPage() {
	const loader = useLoaderData() as LoaderResponse
	const navigate = useNavigate()

	useEffect(() => {
		if (!loader.isLoggedIn) {
			return navigate("/", { replace: true })
		}
	}, [])

	return (
		<>
			<MainComponent />
		</>
	)
}

export async function mainPageLoader() {
	try {
		const isLoggedIn = await getCookie()

		if (isLoggedIn.success) {
			const response: LoaderResponse = {
				message: "You are already logged in",
				success: true,
				isLoggedIn: true,
			}
			return response
		} else {
			const response: LoaderResponse = {
				message: "You can log in",
				success: true,
				isLoggedIn: false,
			}
			return response
		}
	} catch (error) {
		const response: LoaderResponse = {
			message: "There was some error while loading the page",
			success: false,
			isLoggedIn: false,
		}
		return response
	}
}

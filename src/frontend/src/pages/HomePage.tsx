import { useLoaderData, useNavigate } from "react-router-dom"
import { HomeLoaderResponse } from "../../FrontendTypes"
import { getCookie } from "../utils/authUtils"

export default function HomePage() {
	const loader = useLoaderData() as HomeLoaderResponse
	const navigate = useNavigate()

	if (loader.isLoggedIn) {
		navigate("/main")
		return null
	}

	return (
		<>
			<a href="http://127.0.0.1:8000/auth/google">Google login</a>;
		</>
	)
}

export async function homePageLoader(): Promise<HomeLoaderResponse> {
	try {
		const isLoggedIn = await getCookie()

		if (isLoggedIn.success) {
			const response: HomeLoaderResponse = {
				message: "You are already logged in",
				success: true,
				isLoggedIn: true,
			}
			return response
		} else {
			const response: HomeLoaderResponse = {
				message: "You can log in",
				success: true,
				isLoggedIn: false,
			}
			return response
		}
	} catch (error) {
		const response: HomeLoaderResponse = {
			message: "There was some error while loading the page",
			success: false,
			isLoggedIn: false,
		}
		return response
	}
}

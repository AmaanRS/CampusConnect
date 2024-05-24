import Cookie from "js-cookie"
import { CookieResponse, StandardResponse } from "../../FrontendTypes"
import axios from "axios"

export const getCookie = async (): Promise<
	CookieResponse | StandardResponse
> => {
	const token = Cookie.get("token")
	if (token) {
		const VITE_BACKEND_ORIGIN: string = import.meta.env.VITE_BACKEND_ORIGIN

		const validatedCookie = await axios.post(
			`${VITE_BACKEND_ORIGIN}/validateUser`,
			{},
			{
				headers: { Authorization: `Bearer ${token}` },
			},
		)

		if (!validatedCookie || !validatedCookie.data.success) {
			const response: StandardResponse = {
				message: "The token is invalid",
				success: false,
			}
			return response
		}

		const response: CookieResponse = {
			message: "Got the token successfully from Cookies",
			success: true,
			token: token,
		}
		return response
	} else {
		const response: StandardResponse = {
			message: "Could not get the token from Cookies",
			success: false,
		}
		return response
	}
}

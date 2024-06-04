import { createContext, ReactNode, useContext, useState } from "react"
import { IAuthContext } from "../../FrontendTypes"
import axios from "axios"

const VITE_BACKEND_ORIGIN: string = import.meta.env.VITE_BACKEND_ORIGIN

const AuthContext = createContext<IAuthContext | undefined>(undefined)

function AuthProvider({ children }: { children: ReactNode }) {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
	})

	const login = async () => {
		try {
			if (!formData.email || !formData.password) {
				return {
					message: "Both email and password are required",
					success: false,
				}
			}

			const axiosResponse = await axios.post(`${VITE_BACKEND_ORIGIN}/login`, {
				email: formData.email,
				password: formData.password,
			})

			if (!axiosResponse) {
				throw new Error("There is no login response from server")
			}

			return {
				message: axiosResponse.data.message,
				success: axiosResponse.data.success,
				token: axiosResponse.data.token,
			}
		} catch (error) {
			console.log((error as Error).message)
			return {
				message: "There was some error while logging in",
				success: false,
			}
		}
	}

	const signup = async () => {
		try {
			if (!formData.email || !formData.password || !formData.username) {
				return {
					message: "Username, email and password are required",
					success: false,
				}
			}

			const axiosResponse = await axios.post(`${VITE_BACKEND_ORIGIN}/signup`, {
				username: formData.username,
				email: formData.email,
				password: formData.password,
			})

			if (!axiosResponse) {
				throw new Error("There is no signup response from server")
			}

			return {
				message: axiosResponse.data.message,
				success: axiosResponse.data.success,
			}
		} catch (error) {
			console.log(error as Error)
			return {
				message: "There was some error while signing up",
				success: false,
			}
		}
	}

	return (
		<>
			<AuthContext.Provider value={{ formData, setFormData, login, signup }}>
				{children}
			</AuthContext.Provider>
		</>
	)
}

export default AuthProvider

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider")
	}
	return context
}

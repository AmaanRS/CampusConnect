import { Form, useLoaderData, useNavigate } from "react-router-dom"
import { LoaderResponse } from "../../FrontendTypes"
import { getCookie, setCookie } from "../utils/authUtils"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"

export default function HomePage() {
	const loader = useLoaderData() as LoaderResponse
	const navigate = useNavigate()

	const [isLogin, setIsLogin] = useState(true)
	const { formData, setFormData, login, signup } = useAuth()

	useEffect(() => {
		if (loader.isLoggedIn) {
			return navigate("/main", { replace: true })
		}
	})

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}))
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		if (isLogin) {
			// Handle login logic here
			const response = await login()

			//If login is successfull then set the token as a cookie and redirect
			if (response.success && response.token) {
				setCookie(response.token)
				return navigate("/main", { replace: true })
			}

			console.log(response.message)
		} else {
			// Handle signup logic here
			const response = await signup()
			console.log(response.message)
		}
	}

	return (
		<>
			<h1>Home Page</h1>
			<div>
				<button onClick={() => setIsLogin(true)}>Login</button>
				<button onClick={() => setIsLogin(false)}>Signup</button>
			</div>
			<Form method="post" onSubmit={handleSubmit}>
				<div>
					<label>Email:</label>
					<input
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						required
					/>
				</div>
				<div>
					<label>Password:</label>
					<input
						type="password"
						name="password"
						value={formData.password}
						onChange={handleChange}
						required
					/>
				</div>
				{!isLogin && (
					<div>
						<label>Username:</label>
						<input
							type="text"
							name="username"
							value={formData.username}
							onChange={handleChange}
							required
						/>
					</div>
				)}
				<button type="submit">{isLogin ? "Login" : "Signup"}</button>
			</Form>
		</>
	)
}

export async function homePageLoader(): Promise<LoaderResponse> {
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
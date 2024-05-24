import { RouterProvider, createBrowserRouter } from "react-router-dom"
import HomePage from "./pages/HomePage"
import MainPage from "./pages/MainPage"

function App() {
	const router = createBrowserRouter([
		{
			path: "/",
			children: [
				{
					index: true,
					element: <HomePage />,
				},
				{
					path: "redirect/:token",
					element: <MainPage />,
				},
			],
		},
	])

	return (
		<>
			<RouterProvider router={router} />
		</>
	)
}
export default App

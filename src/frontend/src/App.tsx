import { RouterProvider, createBrowserRouter } from "react-router-dom"
import HomePage, { homePageLoader } from "./pages/HomePage"
import MainPage, { mainPageLoader } from "./pages/MainPage"

function App() {
	const router = createBrowserRouter([
		{
			path: "/",
			children: [
				{
					index: true,
					loader:homePageLoader,
					element: <HomePage />,
				},
				{
					path: "main",
					loader:mainPageLoader,
					element: <MainPage />,
				}
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

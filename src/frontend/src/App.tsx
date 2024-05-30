import { RouterProvider, createBrowserRouter } from "react-router-dom"
import HomePage, { homePageLoader } from "./pages/HomePage"
import MainPage from "./pages/MainPage"
import RedirectPage from "./pages/RedirectPage"

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
					element: <MainPage />,
				},
				{
					path: "redirect/:token",
					element: <RedirectPage />,
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

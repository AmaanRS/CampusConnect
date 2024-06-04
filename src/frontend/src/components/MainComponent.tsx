// import * as React from "react"
// import Container from "@mui/material/Container"
// import Box from "@mui/material/Box"
// import AppBar from "@mui/material/AppBar"
// import Toolbar from "@mui/material/Toolbar"
// import IconButton from "@mui/material/IconButton"
// import Typography from "@mui/material/Typography"
// import Card from "@mui/material/Card"
// import CardHeader from "@mui/material/CardHeader"
// import CardMedia from "@mui/material/CardMedia"
// import Avatar from "@mui/material/Avatar"
// import { FixedSizeList, ListChildComponentProps } from "react-window"

// // Sample data for posts
// const posts = Array.from({ length: 100 }, (_, index) => ({
// 	id: index,
// 	username: `User${index + 1}`,
// 	avatar: `https://randomuser.me/api/portraits/men/${index + 1}.jpg`, // Replace with actual image URLs
// 	image: `https://picsum.photos/600/400?random=${index + 1}`, // Replace with actual image URLs
// 	caption: `This is a caption for post ${index + 1}.`,
// }))

// // Function to render each row in the list
// function renderRow(props: ListChildComponentProps) {
// 	const { index, style } = props
// 	const post = posts[index]

// 	return (
// 		<div style={style} key={post.id}>
// 			<Card sx={{ marginBottom: 2 }}>
// 				<CardHeader
// 					avatar={<Avatar alt={post.username} src={post.avatar} />}
// 					action={
// 						<IconButton aria-label="settings">
// 							<span role="img" aria-label="settings">
// 								⚙️
// 							</span>
// 						</IconButton>
// 					}
// 					title={post.username}
// 				/>
// 				<CardMedia
// 					component="img"
// 					height="500"
// 					image={post.image}
// 					alt={`Post by ${post.username}`}
// 				/>
// 				<Box
// 					sx={{ display: "flex", justifyContent: "space-between", padding: 1 }}
// 				>
// 					<IconButton aria-label="add to favorites">
// 						<span role="img" aria-label="like">
// 							❤️
// 						</span>
// 					</IconButton>
// 					<IconButton aria-label="share">
// 						<span role="img" aria-label="share">
// 							🔗
// 						</span>
// 					</IconButton>
// 				</Box>
// 				<Typography variant="body2" color="text.secondary" sx={{ padding: 1 }}>
// 					{post.caption}
// 				</Typography>
// 			</Card>
// 		</div>
// 	)
// }

// // Main component
// export function MainComponent() {
// 	return (
// 		<Container maxWidth="sm">
// 			<AppBar position="fixed">
// 				<Toolbar>
// 					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
// 						Instagram Clone
// 					</Typography>
// 					<IconButton edge="end" color="inherit" aria-label="menu">
// 						<span role="img" aria-label="menu">
// 							☰
// 						</span>
// 					</IconButton>
// 				</Toolbar>
// 			</AppBar>
// 			<Toolbar /> {/* Spacer toolbar with the same height as the AppBar */}
// 			<Box
// 				sx={{
// 					mt: 2,
// 					"& .react-window__list": {
// 						scrollbarWidth: "none", // For Firefox
// 						"&::-webkit-scrollbar": {
// 							display: "none", // For Chrome, Safari, and Opera
// 						},
// 					},
// 				}}
// 			>
// 				<FixedSizeList
// 					className="react-window__list"
// 					height={window.innerHeight - 64} // Subtracting app bar height
// 					width="100%"
// 					itemSize={750} // Adjust based on content
// 					itemCount={posts.length}
// 					overscanCount={3}
// 				>
// 					{renderRow}
// 				</FixedSizeList>
// 			</Box>
// 		</Container>
// 	)
// }

// import Container from "@mui/material/Container"
// import Box from "@mui/material/Box"
// import AppBar from "@mui/material/AppBar"
// import Toolbar from "@mui/material/Toolbar"
// import IconButton from "@mui/material/IconButton"
// import Typography from "@mui/material/Typography"
// import Card from "@mui/material/Card"
// import CardHeader from "@mui/material/CardHeader"
// import CardMedia from "@mui/material/CardMedia"
// import Avatar from "@mui/material/Avatar"
// import { FixedSizeList, ListChildComponentProps } from "react-window"

// // Sample data for posts
// const posts = Array.from({ length: 100 }, (_, index) => ({
// 	id: index,
// 	type: index % 2 === 0 ? "text" : "image", // Alternating between text and image
// 	username: `User${index + 1}`,
// 	avatar: `https://randomuser.me/api/portraits/men/${index + 1}.jpg`, // Replace with actual image URLs
// 	image: `https://picsum.photos/600/400?random=${index + 1}`, // Replace with actual image URLs
// 	caption: `This is a caption for post ${index + 1}.`,
// }))

// // Function to render each row in the list
// function renderRow(props: ListChildComponentProps) {
// 	const { index, style } = props
// 	const post = posts[index]

// 	return (
// 		<div style={style} key={post.id}>
// 			{post.type === "text" ? (
// 				<div>
// 					<Card sx={{ marginBottom: 2 }}>
// 						<CardHeader
// 							avatar={<Avatar alt={post.username} src={post.avatar} />}
// 							action={
// 								<IconButton aria-label="settings">
// 									<span role="img" aria-label="settings">
// 										⚙️
// 									</span>
// 								</IconButton>
// 							}
// 							title={post.username}
// 						/>
// 						<Box
// 							sx={{
// 								display: "flex",
// 								justifyContent: "space-between",
// 								padding: 1,
// 							}}
// 						>
// 							<div>
// 								<h1>Hello</h1>
// 								<h1>Hello</h1>
// 								<h1>Hello</h1>
// 								<h1>Hello</h1>
// 								<h1>Hello</h1>
// 								<h1>Hello</h1>
// 								<h1>Hello</h1>
// 								<h1>Hello</h1>
// 								<h1>Hello</h1>
// 								<h1>Hello</h1>
// 								<h1>Hello</h1>
// 							</div>
// 						</Box>
// 						<Typography
// 							variant="body2"
// 							color="text.secondary"
// 							sx={{ padding: 1 }}
// 						>
// 							{post.caption}
// 						</Typography>
// 					</Card>
// 				</div>
// 			) : (
// 				<Card sx={{ marginBottom: 2 }}>
// 					<CardHeader
// 						avatar={<Avatar alt={post.username} src={post.avatar} />}
// 						action={
// 							<IconButton aria-label="settings">
// 								<span role="img" aria-label="settings">
// 									⚙️
// 								</span>
// 							</IconButton>
// 						}
// 						title={post.username}
// 					/>
// 					<CardMedia
// 						component="img"
// 						height="500"
// 						image={post.image}
// 						alt={`Post by ${post.username}`}
// 					/>
// 					<Box
// 						sx={{
// 							display: "flex",
// 							justifyContent: "space-between",
// 							padding: 1,
// 						}}
// 					>
// 						<IconButton aria-label="add to favorites">
// 							<span role="img" aria-label="like">
// 								❤️
// 							</span>
// 						</IconButton>
// 						<IconButton aria-label="share">
// 							<span role="img" aria-label="share">
// 								🔗
// 							</span>
// 						</IconButton>
// 					</Box>
// 					<Typography
// 						variant="body2"
// 						color="text.secondary"
// 						sx={{ padding: 1 }}
// 					>
// 						{post.caption}
// 					</Typography>
// 				</Card>
// 			)}
// 		</div>
// 	)
// }

// // Main component
// export function MainComponent() {
// 	return (
// 		<Container maxWidth="sm">
// 			<AppBar position="fixed">
// 				<Toolbar>
// 					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
// 						Instagram Clone
// 					</Typography>
// 					<IconButton edge="end" color="inherit" aria-label="menu">
// 						<span role="img" aria-label="menu">
// 							☰
// 						</span>
// 					</IconButton>
// 				</Toolbar>
// 			</AppBar>
// 			<Toolbar /> {/* Spacer toolbar with the same height as the AppBar */}
// 			<Box
// 				sx={{
// 					mt: 2,
// 					"& .react-window__list": {
// 						scrollbarWidth: "none",
// 						"&::-webkit-scrollbar": {
// 							display: "none",
// 						},
// 					},
// 				}}
// 			>
// 				<FixedSizeList
// 					className="react-window__list"
// 					height={window.innerHeight - 64}
// 					width="100%"
// 					itemSize={750}
// 					itemCount={posts.length}
// 					overscanCount={3}
// 				>
// 					{renderRow}
// 				</FixedSizeList>
// 			</Box>
// 		</Container>
// 	)
// }
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import CardMedia from "@mui/material/CardMedia"
import Avatar from "@mui/material/Avatar"
import { VariableSizeList, ListChildComponentProps } from "react-window"

// Sample data for posts
const posts = Array.from({ length: 100 }, (_, index) => ({
	id: index,
	type: index % 2 === 0 ? "text" : "image", // Alternating between text and image
	username: `User${index + 1}`,
	avatar: `https://randomuser.me/api/portraits/men/${index + 1}.jpg`, // Replace with actual image URLs
	image: `https://picsum.photos/600/400?random=${index + 1}`, // Replace with actual image URLs
	caption: `This is a caption for post ${index + 1}.`,
}))

function renderRow(props: ListChildComponentProps) {
	const { index, style } = props
	const post = posts[index]

	return (
		<div style={{ ...style, height: "auto" }} key={post.id}>
			{post.type === "text" ? (
				<div>
					<Card sx={{ marginBottom: 2 }}>
						<CardHeader
							avatar={<Avatar alt={post.username} src={post.avatar} />}
							action={
								<IconButton aria-label="settings">
									<span role="img" aria-label="settings">
										⚙️
									</span>
								</IconButton>
							}
							title={post.username}
						/>
						<Typography>Hello</Typography>
						<Typography>Hello</Typography>
						<Typography>Hello</Typography>
						<Typography>Hello</Typography>
						<Typography>Hello</Typography>
						<Typography>Hello</Typography>
						<Typography>Hello</Typography>
						<Typography>Hello</Typography>
						<Typography>Hello</Typography>
						<Typography
							variant="body2"
							color="text.secondary"
							sx={{ padding: "0 16px" }}
						>
							{post.caption}
						</Typography>
					</Card>
				</div>
			) : (
				<Card sx={{ marginBottom: 2 }}>
					<CardHeader
						avatar={<Avatar alt={post.username} src={post.avatar} />}
						action={
							<IconButton aria-label="settings">
								<span role="img" aria-label="settings">
									⚙️
								</span>
							</IconButton>
						}
						title={post.username}
					/>
					<CardMedia
						component="img"
						height="500"
						image={post.image}
						alt={`Post by ${post.username}`}
					/>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							padding: "8px 16px",
						}}
					>
						<IconButton aria-label="add to favorites">
							<span role="img" aria-label="like">
								❤️
							</span>
						</IconButton>
						<IconButton aria-label="share">
							<span role="img" aria-label="share">
								🔗
							</span>
						</IconButton>
					</Box>
				</Card>
			)}
		</div>
	)
}

// Main component
export function MainComponent() {
	return (
		<Container maxWidth="sm">
			<AppBar position="fixed">
				<Toolbar>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						Instagram Clone
					</Typography>
					<IconButton edge="end" color="inherit" aria-label="menu">
						<span role="img" aria-label="menu">
							☰
						</span>
					</IconButton>
				</Toolbar>
			</AppBar>
			<Toolbar />
			{/* Spacer toolbar with the same height as the AppBar */}
			<Box
				sx={{
					mt: 2,
					"& .react-window__list": {
						scrollbarWidth: "none",
						"&::-webkit-scrollbar": {
							display: "none",
						},
					},
				}}
			>
				<VariableSizeList
					className="react-window__list"
					height={window.innerHeight - 64}
					width="100%"
					itemCount={posts.length}
					itemSize={(index) => {
						const post = posts[index]
						const textHeight =
							100 + post.caption.split(/\r\n|\r|\n/).length * 200 // Approximate height for text content
						const imageHeight = 500 // Height of image content
						return post.type === "text" ? textHeight : imageHeight
					}}
					overscanCount={3}
				>
					{renderRow}
				</VariableSizeList>
			</Box>
		</Container>
	)
}

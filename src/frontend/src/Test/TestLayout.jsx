import ReactPlayer from "react-player";

export default function TestLayout() {
  return (
    <>
      {/* <div className="flex"> */}
      {/* Left Section - Sidebar */}
      <div className="overflow-hidden hover:overflow-auto fixed top-0 left-0 h-screen w-72 bg-gray-100 p-4 hidden sm:block">
        <h2 className="text-xl font-bold">Sidebar</h2>
        <ul>
          <li className="mb-2">Dashboard</li>
          <li className="mb-2">Committees</li>
          <li className="mb-2 h-96">Events</li>
          <li className="mb-2 h-96">Events</li>
          <li className="mb-2">Settings</li>
        </ul>
      </div>

      {/* Center Section - Main Content */}
      <div className="sm:ml-72 sm:mr-72 bg-white p-6 min-h-screen overflow-y-auto m-auto">
        {/* <h1 className="text-2xl font-semibold">Main Content</h1>
        <p>This is the main content area. Scroll to see more content.</p>
        <div style={{ height: "1500px" }}>
          {" "}
          Add your scrollable content here.
        </div> */}
        <ReactPlayer
          controls
          url={"https://www.youtube.com/live/jfKfPfyJRdk?si=62CGTDlYb7P8Qz6T"}
        />
      </div>

      {/* Right Section - Popular Committees */}
      <div className="fixed top-0 right-0 h-screen w-72 bg-gray-100 p-4 hidden sm:block">
        <h2 className="text-xl font-bold mb-4">Popular Committees</h2>
        <ul>
          <li className="mb-2">Committee 1</li>
          <li className="mb-2">Committee 2</li>
          <li className="mb-2">Committee 3</li>
          <li className="mb-2">Committee 4</li>
        </ul>
      </div>
      {/* </div> */}
    </>
  );
}

// post {
//   ...,
//   comment: [refID]
// }

// comment {
//   postId,
//   comment:[]
// }

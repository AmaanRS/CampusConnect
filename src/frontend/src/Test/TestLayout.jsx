// export default function AdminLayout() {
//   const { userState } = useContext(UserContext);
//   const navigate = useNavigate();
//   useEffect(() => {
//     if (userState.accountType !== AccountType.Admin) {
//       navigate("/");
//     }
//   }, []);

//   return (
//     <>
//       {/* left section - sidebar */}
//       <div className="hidden sm:flex fixed left-0 top-0"> </div>
//       {/* center section - main content*/}
//       <div className={` min-h-screen mb-16 w-1/2 md:mb-0 sm:ml-72 `}> </div>
//       {/* right section - showing lists like popular commitees */}
//       {/* to do - right section */}
//     </>
//   );
// }

// export default function TestLayout() {
//   return (
//     <div className="flex">
//       {/* Left Section - Sidebar */}
//       <div className="hidden border-2 border-black sm:flex fixed left-0 top-0 w-72 h-full bg-gray-200 p-4">
//         <h2 className="text-xl font-bold">Sidebar</h2>
//         <ul>
//           <li className="mb-2">Dashboard</li>
//           <li className="mb-2">Committees</li>
//           <li className="mb-2">Events</li>
//           <li className="mb-2">Settings</li>
//         </ul>
//       </div>

//       {/* Center Section - Main Content */}
//       <div className="border-2 border-black min-h-screen mb-16 w-full sm:w-1/2 md:mb-0 sm:ml-72 bg-white p-6">
//         <h1 className="text-2xl font-semibold">Main Content</h1>
//         <p>This is the main content area.</p>
//       </div>

//       {/* Right Section - Popular Committees */}
//       <div className="border-2 border-black hidden sm:block w-1/4 h-full bg-gray-100 p-4 fixed right-0 top-0">
//         <h2 className="text-xl font-bold mb-4">Popular Committees</h2>
//         <ul>
//           <li className="mb-2">Committee 1</li>
//           <li className="mb-2">Committee 2</li>
//           <li className="mb-2">Committee 3</li>
//           <li className="mb-2">Committee 4</li>
//         </ul>
//       </div>
//     </div>
//   );
// }

export default function TestLayout() {
  return (
    <div className="grid grid-cols-12 min-h-screen">
      {/* Left Section - Sidebar */}
      <div className="col-span-3 hidden sm:block bg-gray-200 p-4">
        <h2 className="text-xl font-bold">Sidebar</h2>
        <ul>
          <li className="mb-2">Dashboard</li>
          <li className="mb-2">Committees</li>
          <li className="mb-2">Events</li>
          <li className="mb-2">Settings</li>
        </ul>
      </div>

      {/* Center Section - Main Content */}
      <div className="col-span-6 bg-white p-6">
        <h1 className="text-2xl font-semibold">Main Content</h1>
        <p>This is the main content area.</p>
      </div>

      {/* Right Section - Popular Committees */}
      <div className="col-span-3 hidden sm:block bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-4">Popular Committees</h2>
        <ul>
          <li className="mb-2">Committee 1</li>
          <li className="mb-2">Committee 2</li>
          <li className="mb-2">Committee 3</li>
          <li className="mb-2">Committee 4</li>
        </ul>
      </div>
    </div>
  );
}

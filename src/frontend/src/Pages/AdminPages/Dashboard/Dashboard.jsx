import CentreMainContent from "../../../Components/Layout/Desktop/CentreMainContent";
import RightSidebar from "../../../Components/Layout/Desktop/RightSidebar";

export default function Dashboard() {
  return (
    <>
      <CentreMainContent>
        <div className="h-screen border-[1px] border-gray-300 m-2  flex justify-center items-center">
          <p>Main Content</p>
        </div>
        <div className="h-screen border-[1px] border-gray-300 m-2  flex justify-center items-center">
          <p>Main Content</p>
        </div>
      </CentreMainContent>
      <RightSidebar></RightSidebar>
    </>
  );
}

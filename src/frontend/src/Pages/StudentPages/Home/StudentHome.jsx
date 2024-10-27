import React from "react";
import StudentPost from "./StudentPost";

export default function StudentHome() {
  const data = [1, 2, 3, 41];
  return (
    <div className=" pl-8   p-0 inline-block ">
      {data.map((i) => {
        return <StudentPost key={Math.random()} />;
      })}
    </div>
  );
}

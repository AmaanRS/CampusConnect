import { Avatar, HR } from "flowbite-react";
import React from "react";
import parse from "html-react-parser";
import "./post.scss";

export default function StudentPost() {
  let content = "";

  content = `<h1>Hello,</h1><p>This is a basic <em>demonstration </em>of a <strong>Rich Text Editor</strong>. It includes a <u>variety </u>of <s>essential </s>text formatting options, such as different <sup>styles </sup>you would typically expect from a text editor. However, the real highlight lies in the list functionalities:</p><ul><li><p>Here is a simple bullet list</p></li><li><p>With one item…</p></li><li><p>Or two!</p></li></ul><p>As you can see, the content is fully editable. But that’s not all—let’s explore the use of a code block:</p><pre><code>console.log("Hello Campus")</code></pre><pre><code class="language-css">body {
//   display: none;
// }</code></pre><p>As you can see, the Rich Text Editor offers quite a few advanced features. This is just the beginning, so feel free to explore further and check out the other examples available.</p><blockquote><p><span style="color: rgb(45, 45, 45)">'Appreciation is a wonderful thing. It makes what is excellent in others belong to us as well.' </span></p><p><span style="color: rgb(45, 45, 45)">– Voltaire</span></p></blockquote><p><u>Thank you for your attention.</u></p><hr><p></p>`;

  return (
    <>
      <div className="mx-2 ">
        <div className="flex text-neutral-600 items-center">
          <div>
            <Avatar rounded size={"xs"} />
          </div>
          <div className="text-xs font-semibold ml-2">subname</div>
          <div className="h-[4px] w-[4px] mx-2 rounded-full bg-neutral-500"></div>
          <div className="text-xs">10 min ago</div>
        </div>
        <div>
          <h1 className="my-2 text-lg text-gray-800 font-semibold leading-6">
            How much does a production postgres db with performance equal
          </h1>
          <div className="tiptap-post line-clamp-6  ">
            {parse(
              "<p>Not me but my friend 16M met her 18 on insta. She said she was also 16 year old. They met after 3 weeks , went on a date and everything.After some time my friend went to college in other state.</p><p>Yesterday she messaged him saying she is 4 months pregnant and he is the father and all.</p><p>He has every message from all the Conversations they had. I told him there is nothing to worry about and please tell his parents about all this mess. His family is very conservative .</p><p>Is there any way to register case against him? Or just she is freaking him out?</p><p>Edit : I am talking to him , trying to calm him down , told him he is safe and if she responds ask her about the pregnancy, is it real. If it is , he needs to tell any adult in his family</p>"
            )}{" "}
          </div>
        </div>
      </div>
      <div className="border-b-[1.3px] mx-1 border-gray-200 my-2"></div>
    </>
  );
}

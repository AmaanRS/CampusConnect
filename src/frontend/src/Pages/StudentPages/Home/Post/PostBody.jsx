import React from "react";
import parse from "html-react-parser";

export default function PostBody() {
  let content = "";

  content = `<h1>Hello,</h1><p>This is a basic <em>demonstration </em>of a <strong>Rich Text Editor</strong>. It includes a <u>variety </u>of <s>essential </s>text formatting options, such as different <sup>styles </sup>you would typically expect from a text editor. However, the real highlight lies in the list functionalities:</p><ul><li><p>Here is a simple bullet list</p></li><li><p>With one item…</p></li><li><p>Or two!</p></li></ul><p>As you can see, the content is fully editable. But that’s not all—let’s explore the use of a code block:</p><pre><code>console.log("Hello Campus")</code></pre><pre><code class="language-css">body {
  //   display: none;
  // }</code></pre><p>As you can see, the Rich Text Editor offers quite a few advanced features. This is just the beginning, so feel free to explore further and check out the other examples available.</p><blockquote><p><span style="color: rgb(45, 45, 45)">'Appreciation is a wonderful thing. It makes what is excellent in others belong to us as well.' </span></p><p><span style="color: rgb(45, 45, 45)">– Voltaire</span></p></blockquote><p><u>Thank you for your attention.</u></p><hr><p></p>`;

  return (
    <div className="tiptap-post mb-1 line-clamp-3 text-slate-700   ">
      {parse(`<p>Hey y’all! I think as experienced leetcoders (or not), we underestimate how “easy” some Leetcode problems  are. For me, it’d be Two Sum. I remember not being able to come up with the HashMap as the best fit data structure. 
  
  All to say, the wifey and I came up with a video walkthrough that goes through the actual intuition behind the optimal solution. We also included 2 variants that Meta asks (in case you were studying for it!) - TBH it’s helpful to solve the same problem from different angles with small-to-medium modifications (Spoiler: the second one is about dominoes).</p>
  `)}
    </div>
  );
}

import React from "react";
import parse from "html-react-parser";

export default function PostBody({ content = "" }) {
  let content1 = `<h1>Hello,</h1><p>This is a basic <em>demonstration </em>of a <strong>Rich Text Editor</strong>. It includes a <u>variety </u>of <s>essential </s>text formatting options, such as different <sup>styles </sup>you would typically expect from a text editor. However, the real highlight lies in the list functionalities:</p><ul><li><p>Here is a simple bullet list</p></li><li><p>With one item…</p></li><li><p>Or two!</p></li></ul><p>As you can see, the content is fully editable. But that’s not all—let’s explore the use of a code block:</p><pre><code>console.log("Hello Campus")</code></pre><pre><code class="language-css">body {
    //   display: none;
    // }</code></pre><p>As you can see, the Rich Text Editor offers quite a few advanced features. This is just the beginning, so feel free to explore further and check out the other examples available.</p><blockquote><p><span style="color: rgb(45, 45, 45)">'Appreciation is a wonderful thing. It makes what is excellent in others belong to us as well.' </span></p><p><span style="color: rgb(45, 45, 45)">– Voltaire</span></p></blockquote><p><u>Thank you for your attention.</u></p><hr><p></p>`;

  let content2 = `<p>
  Java is a high-level, class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible. It is a general-purpose programming language intended to let programmers write once, run anywhere (WORA), meaning that compiled Java code can run on all platforms that support Java without the need to recompile. </p>
  
 <p> Java applications are typically compiled to bytecode that can run on any Java virtual machine (JVM) regardless of the underlying computer architecture. The syntax of Java is similar to C and C++, but has fewer low-level facilities than either of them. The Java runtime provides dynamic capabilities (such as reflection and runtime code modification) that are typically not available in traditional compiled languages.
</p>
<p>Java gained popularity shortly after its release, and has been a popular programming language since then. Java was the third most popular programming language in 2022 according to GitHub. Although still widely popular, there has been a gradual decline in use of Java in recent years with other languages using JVM gaining popularity.</p>  `;

  return <div className="tiptap mt-4 ">{parse(content)}</div>;
}

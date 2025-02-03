import React from "react";
import parse from "html-react-parser";

export default function PostBody({ isImage }) {
  let content = "";

  content = `<h1>Hello,</h1><p>This is a basic <em>demonstration </em>of a <strong>Rich Text Editor</strong>. It includes a <u>variety </u>of <s>essential </s>text formatting options, such as different <sup>styles </sup>you would typically expect from a text editor. However, the real highlight lies in the list functionalities:</p><ul><li><p>Here is a simple bullet list</p></li><li><p>With one item…</p></li><li><p>Or two!</p></li></ul><p>As you can see, the content is fully editable. But that’s not all—let’s explore the use of a code block:</p><pre><code>console.log("Hello Campus")</code></pre><pre><code class="language-css">body {
  //   display: none;
  // }</code></pre><p>As you can see, the Rich Text Editor offers quite a few advanced features. This is just the beginning, so feel free to explore further and check out the other examples available.</p><blockquote><p><span style="color: rgb(45, 45, 45)">'Appreciation is a wonderful thing. It makes what is excellent in others belong to us as well.' </span></p><p><span style="color: rgb(45, 45, 45)">– Voltaire</span></p></blockquote><p><u>Thank you for your attention.</u></p><hr><p></p>`;

  return (
    <div
      className={`tiptap-post mb-1,  line-clamp-${
        isImage ? "3" : "6"
      }  text-slate-700`}
    >
      {parse(`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas id fringilla leo, a vehicula turpis. Donec faucibus turpis a justo vestibulum auctor. Phasellus iaculis aliquam placerat. Sed varius in urna ut elementum. Nam convallis massa vitae ipsum congue, consectetur interdum est pretium. In molestie, tortor ut facilisis tempus, urna arcu venenatis velit, quis venenatis felis sem nec magna. Morbi vel dui nunc. Fusce eu tempus neque. Aenean vel lacinia dui, nec scelerisque enim. Quisque libero metus, condimentum sit amet ligula quis, sodales consequat metus. Fusce a bibendum nisi.

Curabitur ut interdum risus. Aliquam ultrices, ligula sit amet maximus condimentum, diam lacus blandit ligula, et consequat mauris libero nec nulla. Mauris eget ligula erat. Quisque erat tortor, pretium id justo ac, commodo gravida urna. Donec cursus molestie justo, et mollis augue eleifend a. Integer venenatis odio in leo vulputate congue. Pellentesque iaculis ligula ut ante pellentesque vulputate. In in aliquet leo. Nam malesuada nulla suscipit gravida mattis. In id imperdiet lacus, non blandit quam. Aliquam a ultricies sem. Duis hendrerit lobortis gravida.

Aliquam euismod risus vel bibendum euismod. Proin ut nunc tincidunt, auctor ligula a, venenatis enim. Morbi consectetur nisi consequat, vestibulum mi sed, pellentesque felis. Nullam accumsan hendrerit lacinia. Vestibulum lobortis auctor mauris non rhoncus. Nullam posuere tellus eu finibus sollicitudin. Quisque nec enim tortor. Nam convallis ex vitae eros pellentesque iaculis. Nam nisi turpis, sodales eget gravida eu, tincidunt vel felis. Curabitur dapibus magna ac neque lacinia placerat. Donec tincidunt nisi sit amet neque varius, vitae ultricies nulla egestas.

  `)}
    </div>
  );
}

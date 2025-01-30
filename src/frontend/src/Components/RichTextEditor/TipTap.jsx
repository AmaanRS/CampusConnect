import "./styles.scss";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import React from "react";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

import { HR } from "flowbite-react";
import MenuBar from "./MenuBar";

let content = "";

//  content = `<h1>Hello,</h1><p>This is a basic <em>demonstration </em>of a <strong>Rich Text Editor</strong>. It includes a <u>variety </u>of <s>essential </s>text formatting options, such as different <sup>styles </sup>you would typically expect from a text editor. However, the real highlight lies in the list functionalities:</p><ul><li><p>Here is a simple bullet list</p></li><li><p>With one item…</p></li><li><p>Or two!</p></li></ul><p>As you can see, the content is fully editable. But that’s not all—let’s explore the use of a code block:</p><pre><code>console.log("Hello Campus")</code></pre><pre><code class="language-css">body {
//   display: none;
// }</code></pre><p>As you can see, the Rich Text Editor offers quite a few advanced features. This is just the beginning, so feel free to explore further and check out the other examples available.</p><blockquote><p><span style="color: rgb(45, 45, 45)">'Appreciation is a wonderful thing. It makes what is excellent in others belong to us as well.' </span></p><p><span style="color: rgb(45, 45, 45)">– Voltaire</span></p></blockquote><p><u>Thank you for your attention.</u></p><hr><p></p>`;

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
  Underline,
  Link.configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: "https",
    protocols: ["http", "https"],
    isAllowedUri: (url, ctx) => {
      try {
        // construct URL
        const parsedUrl = url.includes(":")
          ? new URL(url)
          : new URL(`${ctx.defaultProtocol}://${url}`);

        // use default validation
        if (!ctx.defaultValidate(parsedUrl.href)) {
          return false;
        }

        // disallowed protocols
        const disallowedProtocols = ["ftp", "file", "mailto"];
        const protocol = parsedUrl.protocol.replace(":", "");

        if (disallowedProtocols.includes(protocol)) {
          return false;
        }

        // only allow protocols specified in ctx.protocols
        const allowedProtocols = ctx.protocols.map((p) =>
          typeof p === "string" ? p : p.scheme
        );

        if (!allowedProtocols.includes(protocol)) {
          return false;
        }

        // disallowed domains
        const disallowedDomains = [
          "example-phishing.com",
          "malicious-site.net",
        ];
        const domain = parsedUrl.hostname;

        if (disallowedDomains.includes(domain)) {
          return false;
        }

        // all checks have passed
        return true;
      } catch {
        return false;
      }
    },
    shouldAutoLink: (url) => {
      try {
        // construct URL
        const parsedUrl = url.includes(":")
          ? new URL(url)
          : new URL(`https://${url}`);

        // only auto-link if the domain is not in the disallowed list
        const disallowedDomains = [
          "example-no-autolink.com",
          "another-no-autolink.com",
        ];
        const domain = parsedUrl.hostname;

        return !disallowedDomains.includes(domain);
      } catch {
        return false;
      }
    },
  }),
  Superscript,
  Subscript,
  Placeholder.configure({
    placeholder: "Write Post Content Here",
  }),
];

export default function TipTap({ getEditorContent }) {
  const editor = useEditor({
    editable: true,
    content,
    extensions,
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="">
      <div className="border border-slate-300 rounded-md  ">
        <MenuBar editor={editor} />
        <HR className="m-0 border border-t-slate-300" />
        <EditorContent
          onBlur={() => getEditorContent(editor.getHTML())}
          className="custom-scrollbar max-h-96 overflow-auto"
          editor={editor}
        />
      </div>
    </div>
  );
}

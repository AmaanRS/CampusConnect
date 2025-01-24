import { useCallback } from "react";
import RTEButton from "./RTEButton";
import { MdFormatListBulleted } from "react-icons/md";
import { RiListOrdered2 } from "react-icons/ri";
import { FaQuoteLeft } from "react-icons/fa6";
import { FaStrikethrough } from "react-icons/fa6";
import { FaUndoAlt } from "react-icons/fa";
import { FaRedoAlt } from "react-icons/fa";
import { MdHorizontalRule } from "react-icons/md";
import { FaLink } from "react-icons/fa6";
import { FaLinkSlash } from "react-icons/fa6";
import { VscNewline } from "react-icons/vsc";
import { AiOutlineEnter } from "react-icons/ai";

export default function MenuBar({ editor }) {
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    try {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    } catch (e) {
      alert(e.message);
    }
  }, [editor]);

  return (
    <>
      <div className="rounded-md p-2">
        <RTEButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive("bold")}
        >
          <strong>B</strong>
        </RTEButton>
        <RTEButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
        >
          <b>
            <i>i</i>
          </b>
        </RTEButton>
        <RTEButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "is-active" : ""}
        >
          <b>
            <u>U</u>
          </b>
        </RTEButton>
        <RTEButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}
          icon={<FaStrikethrough className="inline" />}
        ></RTEButton>
        <RTEButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={editor.isActive("code") ? "is-active" : ""}
        >
          Code
        </RTEButton>
        <RTEButton onClick={() => editor.chain().focus().unsetAllMarks().run()}>
          Clear marks
        </RTEButton>
        <RTEButton onClick={() => editor.chain().focus().clearNodes().run()}>
          Clear nodes
        </RTEButton>
        <RTEButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive("paragraph") ? "is-active" : ""}
        >
          Paragraph
        </RTEButton>
        <RTEButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "is-active" : ""
          }
        >
          H1
        </RTEButton>
        <RTEButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? "is-active" : ""
          }
        >
          H2
        </RTEButton>
        <RTEButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 }) ? "is-active" : ""
          }
        >
          H3
        </RTEButton>
        <RTEButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          className={
            editor.isActive("heading", { level: 4 }) ? "is-active" : ""
          }
        >
          H4
        </RTEButton>
        <RTEButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          className={
            editor.isActive("heading", { level: 5 }) ? "is-active" : ""
          }
        >
          H5
        </RTEButton>
        <RTEButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          className={
            editor.isActive("heading", { level: 6 }) ? "is-active" : ""
          }
        >
          H6
        </RTEButton>
        <RTEButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
          icon={<MdFormatListBulleted className="inline text-lg" />}
        ></RTEButton>
        <RTEButton
          icon={<RiListOrdered2 className="inline text-lg" />}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
        ></RTEButton>
        <RTEButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive("codeBlock") ? "is-active" : ""}
        >
          Code block
        </RTEButton>
        <RTEButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "is-active" : ""}
          icon={<FaQuoteLeft className="inline-block" />}
        ></RTEButton>
        <RTEButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          icon={<MdHorizontalRule className="inline" />}
        ></RTEButton>
        <RTEButton
          icon={<AiOutlineEnter className="inline " />}
          onClick={() => editor.chain().focus().setHardBreak().run()}
        ></RTEButton>
        <RTEButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          icon={<FaUndoAlt className="inline" />}
        ></RTEButton>
        <RTEButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          icon={<FaRedoAlt className="inline" />}
        ></RTEButton>

        <RTEButton
          icon={<FaLink className="inline" />}
          onClick={setLink}
          className={editor.isActive("link")}
        ></RTEButton>

        <RTEButton
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive("link")}
          icon={<FaLinkSlash className="inline" />}
        ></RTEButton>
      </div>
    </>
  );
}

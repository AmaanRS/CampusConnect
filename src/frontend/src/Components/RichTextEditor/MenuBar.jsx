import { useCallback } from "react";
import RTEButton from "./RTEButton";
import {
  FaBold,
  FaItalic,
  FaQuoteLeft,
  FaUnderline,
  FaCode,
} from "react-icons/fa6";
import { FaStrikethrough } from "react-icons/fa6";
import { FaUndoAlt } from "react-icons/fa";
import { FaRedoAlt } from "react-icons/fa";
import { MdFormatClear, MdHorizontalRule, MdLayersClear } from "react-icons/md";
import { FaLink } from "react-icons/fa6";
import { FaLinkSlash } from "react-icons/fa6";
import { AiOutlineEnter } from "react-icons/ai";
import { FaListUl } from "react-icons/fa";
import { FaListOl } from "react-icons/fa";
import { ImSubscript2, ImSuperscript2 } from "react-icons/im";
import { BiParagraph } from "react-icons/bi";
import {
  RiCodeBlock,
  RiH1,
  RiH2,
  RiH3,
  RiH4,
  RiH5,
  RiH6,
} from "react-icons/ri";

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
      <div className=" flex flex-wrap rounded-md p-2">
        <RTEButton
          icon={<FaBold className="inline" />}
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive("bold")}
        >
          Bold
        </RTEButton>
        <RTEButton
          icon={<FaItalic className="inline" />}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
        >
          Italic
        </RTEButton>
        <RTEButton
          icon={<FaUnderline className="inline" />}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "is-active" : ""}
        >
          Underlined
        </RTEButton>

        <RTEButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}
          icon={<FaStrikethrough className="inline" />}
        >
          Strikethrough
        </RTEButton>

        <RTEButton
          icon={<ImSuperscript2 className="inline text-lg" />}
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          className={editor.isActive("superscript") ? "is-active" : ""}
        >
          Superscript
        </RTEButton>
        <RTEButton
          icon={<ImSubscript2 className="inline text-lg" />}
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          className={editor.isActive("subscript") ? "is-active" : ""}
        >
          Subscript
        </RTEButton>

        <RTEButton
          icon={<FaCode className="inline text-lg" />}
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={editor.isActive("code") ? "is-active" : ""}
        >
          Code
        </RTEButton>
        <RTEButton
          icon={<MdFormatClear className="inline text-xl" />}
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
        >
          Clear marks
        </RTEButton>
        <RTEButton
          icon={<MdLayersClear className="inline text-xl" />}
          onClick={() => editor.chain().focus().clearNodes().run()}
        >
          Clear nodes
        </RTEButton>
        <RTEButton
          icon={<BiParagraph className="inline text-xl" />}
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive("paragraph") ? "is-active" : ""}
        >
          Paragraph
        </RTEButton>
        <RTEButton
          icon={<RiH1 className="inline text-lg " />}
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
          icon={<RiH2 className="inline text-lg " />}
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
          icon={<RiH3 className="inline text-lg " />}
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
          icon={<RiH4 className="inline text-lg " />}
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
          icon={<RiH5 className="inline text-lg " />}
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
          icon={<RiH6 className="inline text-lg " />}
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
          icon={<FaListUl className="inline" />}
        >
          Unorderd List
        </RTEButton>
        <RTEButton
          icon={<FaListOl className="inline" />}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
        >
          Ordered List
        </RTEButton>
        <RTEButton
          icon={<RiCodeBlock className="inline text-xl" />}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive("codeBlock") ? "is-active" : ""}
        >
          Code block
        </RTEButton>
        <RTEButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "is-active" : ""}
          icon={<FaQuoteLeft className="inline-block" />}
        >
          Quote Block
        </RTEButton>
        <RTEButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          icon={<MdHorizontalRule className="inline" />}
        >
          Horizontal Line
        </RTEButton>
        <RTEButton
          icon={<AiOutlineEnter className="inline " />}
          onClick={() => editor.chain().focus().setHardBreak().run()}
        >
          Line Break
        </RTEButton>
        <RTEButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          icon={<FaUndoAlt className="inline" />}
        >
          Undo
        </RTEButton>
        <RTEButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          icon={<FaRedoAlt className="inline" />}
        >
          Redo
        </RTEButton>

        <RTEButton
          icon={<FaLink className="inline text-lg" />}
          onClick={setLink}
          className={editor.isActive("link")}
        >
          Set Link
        </RTEButton>

        <RTEButton
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive("link")}
          icon={<FaLinkSlash className="inline text-lg" />}
        >
          Remove Link
        </RTEButton>
      </div>
    </>
  );
}

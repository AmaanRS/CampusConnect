import {
  Mark,
  mergeAttributes
} from "./chunk-7BOXJOEQ.js";
import "./chunk-HXA6O6EE.js";

// node_modules/@tiptap/extension-superscript/dist/index.js
var Superscript = Mark.create({
  name: "superscript",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "sup"
      },
      {
        style: "vertical-align",
        getAttrs(value) {
          if (value !== "super") {
            return false;
          }
          return null;
        }
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["sup", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
  addCommands() {
    return {
      setSuperscript: () => ({ commands }) => {
        return commands.setMark(this.name);
      },
      toggleSuperscript: () => ({ commands }) => {
        return commands.toggleMark(this.name);
      },
      unsetSuperscript: () => ({ commands }) => {
        return commands.unsetMark(this.name);
      }
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-.": () => this.editor.commands.toggleSuperscript()
    };
  }
});
export {
  Superscript,
  Superscript as default
};
//# sourceMappingURL=@tiptap_extension-superscript.js.map

import { Node, mergeAttributes } from '@tiptap/core';
import { nodeInputRule } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import Component from '~/components/CodeBlock.vue';

const CodeBlock = Node.create({
  name: 'codeBlock',
  group: 'block',
  content: 'text*',
  marks: '',
  code: true,
  defining: true,

  addOptions() {
    return {
      languagePrefix: 'language-',
      defaultLanguage: 'text',
    };
  },

  addAttributes() {
    return {
      language: {
        default: this.options.languagePrefix,
      },
      code: {
        default: '',
      },
      id: {
        default: '',
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: 'code-block',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['code-block', mergeAttributes(HTMLAttributes)];
  },

  // addCommands() {
  //   return {
  //     setCodeBlock:
  //       () =>
  //       ({ commands }) => {
  //         return commands.setNode('codeBlock');
  //       },
  //   };
  // },

  addInputRules() {
    const inputRegex = /^```([a-z]+)?[\s\n]$/;
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: (match) => {
          const language = match[1] || this.options.defaultLanguage;
          console.log(language);
          return { language };
        },
      }),
    ];
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from, empty } = selection;

        if (!empty || $from.parent.type !== this.type) {
          return false;
        }

        const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2;
        const endsWithDoubleNewline = $from.parent.textContent.endsWith('\n\n');

        if (!isAtEnd || !endsWithDoubleNewline) {
          return false;
        }

        return editor
          .chain()
          .command(({ tr }) => {
            tr.delete($from.pos - 2, $from.pos);

            return true;
          })
          .exitCode()
          .run();
      },
    };
  },

  addNodeView() {
    return VueNodeViewRenderer(Component);
  },
});

export default CodeBlock;

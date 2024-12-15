import { Node, mergeAttributes } from '@tiptap/core';
import { nodeInputRule } from '@tiptap/core';

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
    }
  },

  addAttributes() {
    return {
      language: {
        default: this.options.languagePrefix,
      }
    }
  },

  // parseHTML() {
  //   return [
  //     {
  //       tag: 'pre',
  //     },
  //   ];
  // },

  renderHTML({ node }) {
    const languagePrefix = this.options.languagePrefix;
    const language = node.attrs.language || this.options.defaultLanguage;
    return ['div', { class: languagePrefix + language }, ['pre', {}, ['code', 0]]];
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
        getAttributes: match => {
          const language = match[1] || this.options.defaultLanguage;
          console.log(language)
          return { language }
        }
      }),
    ];
  }
});

export default CodeBlock;

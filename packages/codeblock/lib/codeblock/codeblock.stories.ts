import type { Meta, StoryObj } from '@storybook/web-components';
import './codeblock';
import { html } from 'lit';
import { CodeBlockProps } from './codeblock.models';

const meta = {
  title: 'Example/CodeBlock',
  tags: ['autodocs'],
  render: (args) => Template(args),
  // argTypes: {
    // variant: {
    //   options: ['primary', 'secondary', 'tertiary'],
    //   control: { type: 'select' },
    // },
  // },
  // args: {},
} satisfies Meta<CodeBlockProps>;

const Template = (args: CodeBlockProps) => {
  return html`
    <ds-codeblock .text=${args.text}></ds-codeblock>
  `;
};

export default meta;
type Story = StoryObj<CodeBlockProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    text: 'Hello world!'
  },
};

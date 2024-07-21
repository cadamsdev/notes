import { css } from 'lit';

export const styles = css`
  .container {
    position: relative;
    line-height: 0;
  }

  textarea,
  pre {
    margin: 0;
    padding: 4.8rem 1.6rem 1.6rem 1.6rem;
    border: none;
    min-height: 91px;
    overflow: auto;
    white-space: nowrap;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 350px;
  }

  textarea,
  pre,
  pre * {
    font-size: 1.6rem;
    font-family: monospace;
    line-height: 1.6;
    tab-size: 2;
  }

  textarea {
    z-index: 1;
    background: transparent;
    color: transparent;
    caret-color: white;
    resize: none;
  }

  textarea:focus-visible {
    outline: none;
  }

  textarea::selection {
    color: rgb(255, 255, 255, 0.75);
  }

  pre {
    z-index: 0;
  }

  code {
    white-space: pre;
  }
`;

import { css } from 'lit';

export const styles = css`
  .container {
    position: relative;
    line-height: 0;
  }

  textarea,
  pre {
    box-sizing: border-box;
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

  /* Dropdown */

  .dropdown {
    position: absolute;
    top: 0.8rem;
    left: 0.8rem;
    background: var(--clr-bg, #151415);
    color: var(--clr-text-primary, #b3b3b3);
    border: 0.1rem solid var(--clr-bg-border, #2d2b2d);
    z-index: 2;
  }

  /* Copy button */

  .copy-btn {
    position: absolute;
    top: 0.8rem;
    right: 0.8rem;
    padding: 0.2rem 0.8rem;
    background: var(--clr-bg, #151415);
    border: 0.1rem solid var(--clr-bg-border, #2d2b2d);
    color: var(--clr-text-primary, #b3b3b3);
    font-size: 1.2rem;
    line-height: 1.5;
    z-index: 2;
  }
`;

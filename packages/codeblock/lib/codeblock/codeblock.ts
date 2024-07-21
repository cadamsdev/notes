import { customElement, property } from 'lit/decorators.js';
import { } from './codeblock.models';
import { html, LitElement } from 'lit';
import { styles } from './codeblock.styles';

@customElement('ds-codeblock')
export class DSCodeBlock extends LitElement {
  static override styles = [styles];

  @property()
  text = '';

  override render() {
    return html`
      <div class="container">
        <textarea>${this.text}</textarea>
        <pre>
          <code>
          </code>
      </pre>
      </div>
    `;
  }
}

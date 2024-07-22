import { customElement, property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { html, LitElement } from 'lit';
import { Task } from '@lit/task';
import { BundledTheme, codeToHtml, type BundledLanguage } from 'shiki';
import { styles } from './codeblock.styles';

const defaultTheme: BundledTheme = 'one-dark-pro';

@customElement('ds-codeblock')
export class DSCodeBlock extends LitElement {
  static override styles = [styles];

  @property()
  text = '';

  @property()
  language: BundledLanguage | 'text' = 'text';

  private _shikiRef = createRef();

  override render() {
    return html`
      <div class="container">
        <textarea
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          @input=${this._onInput}
        >${this.text}</textarea>

        ${this._highlightTask.render({
          pending: () => html``,
          complete: (code) => html`
          <div
            class="shiki-container"
            .innerHTML=${code}
            ${ref(this._shikiRef)}
          ></div>
          `,
          error: () => html``,
        })}
      </div>
    `;
  }

  private _highlightTask = new Task(this, {
    task: async () => {
      const hc = await codeToHtml(this.text, {
        lang: 'javascript',
        theme: defaultTheme,
      });
      return hc;
    },
    args: () => [],
  });

  private async _onInput(e: Event) {
    const text = (e.currentTarget as HTMLTextAreaElement).value;

    const hc = await codeToHtml(text, {
      lang: 'javascript',
      theme: defaultTheme,
    });

    if (this._shikiRef.value) {
      this._shikiRef.value.innerHTML = hc;
    }
  }

}

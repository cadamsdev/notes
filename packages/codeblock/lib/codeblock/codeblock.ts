import { customElement, property, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { html, LitElement } from 'lit';
import { Task } from '@lit/task';
import { bundledLanguages, BundledTheme, codeToHtml, type BundledLanguage } from 'shiki';
import { styles } from './codeblock.styles';

const defaultTheme: BundledTheme = 'one-dark-pro';

@customElement('ds-codeblock')
export class DSCodeBlock extends LitElement {
  static override styles = [styles];

  @property()
  text = '';

  @property()
  language: BundledLanguage | 'text' = 'text';

  @state()
  private _copyBtnText = 'Copy';

  private _textareaRef = createRef<HTMLTextAreaElement>();
  private _shikiRef = createRef<HTMLDivElement>();

  override render() {
    return html`
      <div class="container">
        <select class="dropdown" @change=${this._handleChangeLangauge}>
          ${this._getLanguages().map((language) => {
            return html`<option
              .selected=${language === 'text'}
              .value=${language}
            >
              ${language}
            </option>`;
          })}
        </select>

        <button class="copy-btn" @click=${this._handleClickCopyBtn}>
          ${this._copyBtnText}
        </button>

        <textarea
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          @input=${this._onInput}
          ${ref(this._textareaRef)}
        >
${this.text}</textarea
        >

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
    let text = (e.currentTarget as HTMLTextAreaElement).value;

    if (text[text.length - 1] === '\n') {
      text += ' ';
    }

    const hc = await codeToHtml(text, {
      lang: 'javascript',
      theme: defaultTheme,
    });

    if (this._shikiRef.value) {
      this._shikiRef.value.innerHTML = hc;
    }
  }

  private async _handleChangeLangauge(e: Event) {
    const language = (e.target as HTMLSelectElement).value;
      const hc = await codeToHtml(this.text, {
        lang: language,
        theme: defaultTheme,
      });

      if (this._shikiRef.value) {
        this._shikiRef.value.innerHTML = hc;
      }
  }

  private _handleClickCopyBtn() {
    if (!this._textareaRef.value) {
      return;
    }

    const text = this._textareaRef.value.value || '';
    navigator.clipboard.writeText(text).then(() => {
      this._copyBtnText = 'Copied!';
      setTimeout(() => {
        this._copyBtnText = 'Copy';
      }, 1000);
    });
  }

  private _getLanguages(): string[] {
    const languages = Object.keys(bundledLanguages).map((language) => language);
    languages.push('text');
    return languages.map((language) => language.toLowerCase()).sort();
  }
}

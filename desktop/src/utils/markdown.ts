import { marked } from 'marked';
import { createHighlighter } from 'shiki';

let highlighter: any = null;

// Initialize Shiki highlighter
async function initHighlighter() {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ['github-dark'],
      langs: [
        'javascript',
        'typescript',
        'python',
        'rust',
        'java',
        'html',
        'css',
        'json',
        'markdown',
        'bash',
        'shell',
        'sql',
        'yaml',
        'xml',
      ],
    });
  }
  return highlighter;
}

// Custom renderer for code blocks using Shiki
const renderer = new marked.Renderer();

// Custom link renderer to open links in new tab
renderer.link = function(token: any) {
  const { href, title, text } = token;
  const titleAttr = title ? ` title="${title}"` : '';
  return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
};

renderer.code = function(token: any) {
  const { text: code, lang: language } = token;
  
  if (!highlighter || !language) {
    // Fallback to default - create basic code block
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    
    return `
      <div class="code-block-wrapper">
        <div class="code-block-header">
          <span class="code-language">${language || 'plaintext'}</span>
          <button class="code-copy-btn" onclick="copyCode(this)" title="Copy code">
            <svg class="copy-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <svg class="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
        </div>
        <pre><code class="language-${language || 'plaintext'}">${escapedCode}</code></pre>
      </div>`;
  }

  try {
    const html = highlighter.codeToHtml(code, {
      lang: language,
      theme: 'github-dark',
    });
    
    // Wrap the Shiki output with header
    return `
      <div class="code-block-wrapper">
        <div class="code-block-header">
          <span class="code-language">${language}</span>
          <button class="code-copy-btn" onclick="copyCode(this)" title="Copy code">
            <svg class="copy-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <svg class="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
        </div>
        ${html}
      </div>`;
  } catch (error) {
    console.error('Shiki highlighting error:', error);
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    return `
      <div class="code-block-wrapper">
        <div class="code-block-header">
          <span class="code-language">${language || 'plaintext'}</span>
          <button class="code-copy-btn" onclick="copyCode(this)" title="Copy code">
            <svg class="copy-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <svg class="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
        </div>
        <pre><code class="language-${language || 'plaintext'}">${escapedCode}</code></pre>
      </div>`;
  }
};

// Configure marked options
marked.setOptions({
  breaks: true, // Convert \n to <br>
  gfm: true, // GitHub Flavored Markdown
  renderer,
});

// Initialize highlighter immediately
initHighlighter();

// Export the render function
export async function renderMarkdown(content: string): Promise<string> {
  // Ensure highlighter is ready
  await initHighlighter();
  return marked.parse(content) as string;
}

// Export synchronous version for cases where async isn't needed
export function renderMarkdownSync(content: string): string {
  return marked.parse(content) as string;
}

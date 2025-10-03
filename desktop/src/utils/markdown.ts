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
    return `<pre><code class="language-${language || 'plaintext'}">${escapedCode}</code></pre>`;
  }

  try {
    const html = highlighter.codeToHtml(code, {
      lang: language,
      theme: 'github-dark',
    });
    return html;
  } catch (error) {
    console.error('Shiki highlighting error:', error);
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    return `<pre><code class="language-${language || 'plaintext'}">${escapedCode}</code></pre>`;
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

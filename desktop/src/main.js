import { createApp } from 'vue';
import App from './App.vue';

// Global function to copy code from code blocks
window.copyCode = function (button) {
  const wrapper = button.closest('.code-block-wrapper');
  const codeElement =
    wrapper.querySelector('pre code') || wrapper.querySelector('code');

  if (codeElement) {
    const code = codeElement.textContent || codeElement.innerText;

    // Copy to clipboard
    navigator.clipboard
      .writeText(code)
      .then(() => {
        // Show check icon
        const copyIcon = button.querySelector('.copy-icon');
        const checkIcon = button.querySelector('.check-icon');

        copyIcon.style.display = 'none';
        checkIcon.style.display = 'block';
        button.classList.add('copied');

        // Reset after 2 seconds
        setTimeout(() => {
          copyIcon.style.display = 'block';
          checkIcon.style.display = 'none';
          button.classList.remove('copied');
        }, 2000);
      })
      .catch((err) => {
        console.error('Failed to copy code:', err);
      });
  }
};

createApp(App).mount('#app');

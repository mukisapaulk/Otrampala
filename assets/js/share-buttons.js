document.addEventListener('DOMContentLoaded', () => {
  const shareButton = document.querySelector('.share-button');
  const shareDropdown = document.querySelector('.share-dropdown');
  const copyLinkButton = document.querySelector('.copy-link');

  // Ensure all required elements exist
  if (!shareButton || !shareDropdown || !copyLinkButton) {
    console.error('One or more required elements (.share-button, .share-dropdown, .copy-link) not found.');
    return;
  }

  // Toggle dropdown
  shareButton.addEventListener('click', (e) => {
    e.preventDefault();
    shareDropdown.style.display = shareDropdown.style.display === 'block' ? 'none' : 'block';
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!shareButton.contains(e.target) && !shareDropdown.contains(e.target)) {
      shareDropdown.style.display = 'none';
    }
  });

  // Copy link to clipboard
  copyLinkButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const url = copyLinkButton.getAttribute('data-url');

    if (!url) {
      console.error('No URL found in data-url attribute.');
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      
      // Update button content to show success with SVG
      copyLinkButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-copy-check" aria-hidden="true">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M18.333 6a3.667 3.667 0 0 1 3.667 3.667v8.666a3.667 3.667 0 0 1 -3.667 3.667h-8.666a3.667 3.667 0 0 1 -3.667 -3.667v-8.666a3.667 3.667 0 0 1 3.667 -3.667zm-3.333 -4c1.094 0 1.828 .533 2.374 1.514a1 1 0 1 1 -1.748 .972c-.221 -.398 -.342 -.486 -.626 -.486h-10c-.548 0 -1 .452 -1 1v9.998c0 .32 .154 .618 .407 .805l.1 .065a1 1 0 1 1 -.99 1.738a3 3 0 0 1 -1.517 -2.606v-10c0 -1.652 1.348 -3 3 -3zm1.293 9.293l-3.293 3.292l-1.293 -1.292a1 1 0 0 0 -1.414 1.414l2 2a1 1 0 0 0 1.414 0l4 -4a1 1 0 0 0 -1.414 -1.414"/>
        </svg>
        <span class="share-copy copy-color">Copied!</span>
      `;
      
      // Revert to original content after 2 seconds
      setTimeout(() => {
        copyLinkButton.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-copy" aria-hidden="true">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z"/>
            <path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1"/>
          </svg>
          <span class="share-copy">Copy link</span>
        `;
      }, 2000);
    } catch (error) {
      console.error('Failed to copy URL to clipboard:', error);
    }
  });
});
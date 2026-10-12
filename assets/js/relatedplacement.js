document.addEventListener('DOMContentLoaded', function () {
    const content = document.querySelector('.gh-content');
    const relatedSource = document.querySelector('.js-related-posts-source');

    if (!content || !relatedSource) return;

    // Randomly choose between 2 or 3
    const insertAfterParagraph = Math.random() < 0.5 ? 2 : 3;

    const paragraphs = content.querySelectorAll(':scope > p');

    if (paragraphs.length >= insertAfterParagraph) {
        paragraphs[insertAfterParagraph - 1].after(relatedSource);
    }
    // If not enough paragraphs, it stays at the bottom (which is fine)
});
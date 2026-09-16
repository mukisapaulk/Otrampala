document.addEventListener('DOMContentLoaded', function () {
    const numberOfArticlesToShow = 9;
    const feedContainer = document.getElementById('random-article-feed');

    if (!feedContainer) return;

    const allArticles = Array.from(feedContainer.querySelectorAll('.randomized-article'));
    if (allArticles.length === 0) return;

    // Shuffle using Fisher-Yates
    for (let i = allArticles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allArticles[i], allArticles[j]] = [allArticles[j], allArticles[i]];
    }

    // Show only X randomized articles
    allArticles.slice(0, numberOfArticlesToShow).forEach(article => {
        article.style.display = 'block';
    });
});

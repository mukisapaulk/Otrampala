// Make toggleNav globally accessible for inline onclick
window.toggleNav = function (el) {
  const navPanel = document.getElementById('navPanel');
  if (navPanel && el) {
    navPanel.classList.toggle('active');
    el.classList.toggle('active');
  }
};

// Category and Subcategory Data
const data = {
  categories: [
    {
      name: "National",
      url: "/national/",
      subcategories: [
        { name: "Development", url: "/national/development/" },
        { name: "Law & Crime", url: "/national/law-and-crime/" },
        { name: "Politics", url: "/national/politics/" }
      ]
    },
    {
      name: "International",
      url: "/international/",
      subcategories: [
        { name: "Asia", url: "/international/asia/" },
        { name: "Rest of Africa", url: "/international/rest-of-africa/" },
        { name: "Europe", url: "/international/europe/" },
        { name: "USA", url: "/international/usa/" },
        { name: "Middle East", url: "/international/middle-east/" }
      ]
    },
    {
      name: "Economy",
      url: "/economy/",
      subcategories: [
        { name: "Business", url: "/economy/business/" },
        { name: "Finance", url: "/economy/finance/" },
        { name: "Markets", url: "/economy/markets/" }
      ]
    },
    {
      name: "Technology",
      url: "/technology/",
      subcategories: [
        { name: "AI", url: "/technology/ai/" },
        { name: "Programming", url: "/technology/programming/" },
        { name: "Telecommunication", url: "/technology/telecommunication/" },
        { name: "Innovation", url: "/technology/innovation/" }
      ]
    },
    {
      name: "Entertainment",
      url: "/entertainment/",
      subcategories: [
        { name: "Art & Culture", url: "/entertainment/art-and-culture/" },
        { name: "Korean Drama", url: "/entertainment/korean-drama/" },
        { name: "KLA Events", url: "/entertainment/kla-events/" },
        { name: "Video games", url: "/entertainment/video-games/" },
        { name: "Film", url: "/entertainment/film/" },
        { name: "Music", url: "/entertainment/music/" },
        { name: "Scoop", url: "/entertainment/scoop/" },
        { name: "Celebrity", url: "/entertainment/celebrity/" }
      ]
    },
    {
      name: "Lifestyle",
      url: "/lifestyle/",
      subcategories: [
        { name: "Food", url: "/lifestyle/food/" },
        // { name: "Health", url: "/lifestyle/health/" },
        { name: "Travelling", url: "/lifestyle/travelling/" },
        { name: "Relationship Advice", url: "/lifestyle/relationship-advice/" },
        { name: "Books", url: "/lifestyle/books/" },
        { name: "Fashion", url: "/lifestyle/fashion/" }
      ]
    },
    {
      name: "Sport",
      url: "/sport/",
      subcategories: [
        { name: "Football", url: "/sport/football/" },
        { name: "Rugby", url: "/sport/rugby/" },
        { name: "NFL", url: "/sport/nfl/" },
        { name: "Cricket", url: "/sport/cricket/" },
        { name: "Ugandan Premier League", url: "/sport/ugandan-premier-league/" },
        { name: "Basketball", url: "/sport/basketball/" },
        { name: "Formula One", url: "/sport/formula-one/" },
        { name: "Other", url: "/sport/other/" }
      ]
    }
  ]
};

// Render the menu HTML into #menuContainer
function renderMenu(categories) {
  const menuContainer = document.getElementById('menuContainer');
  if (!menuContainer) return;
  menuContainer.innerHTML = ''; // Clear existing content

  categories.forEach(category => {
    const categoryItem = document.createElement('li');
    categoryItem.className = 'main-navi';

    const wrapperDiv = document.createElement('div');
    wrapperDiv.className = 'main-navi-header';

    const categoryLink = document.createElement('a');
    categoryLink.href = category.url;
    categoryLink.textContent = category.name;
    wrapperDiv.appendChild(categoryLink);

    // Add arrow if subcategories exist
    if (category.subcategories?.length > 0) {
      const arrow = document.createElement('span');
      arrow.className = 'arr';
      arrow.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
        </svg>
      `;
      wrapperDiv.appendChild(arrow); // FIXED: was "arr" before
    }

    categoryItem.appendChild(wrapperDiv);

    // Add submenu
    if (category.subcategories?.length > 0) {
      const submenu = document.createElement('ul');
      submenu.classList.add('submenu');

      category.subcategories.forEach(sub => {
        const subLi = document.createElement('li');
        const subLink = document.createElement('a');
        subLink.href = sub.url;
        subLink.textContent = sub.name;
        subLi.appendChild(subLink);
        submenu.appendChild(subLi);
      });

      categoryItem.appendChild(submenu);
    }

    menuContainer.appendChild(categoryItem);
  });
}

// Submenu toggle logic
document.addEventListener('DOMContentLoaded', function () {
  renderMenu(data.categories); // Inject menu items

  // Bind click to toggle
  document.addEventListener('click', function (e) {
    if (e.target.closest('.arr')) {
      const parentLi = e.target.closest('li');
      if (parentLi) {
        parentLi.classList.toggle('active');
      }
    }
  });
});

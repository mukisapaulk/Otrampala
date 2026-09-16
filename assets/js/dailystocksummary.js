document.addEventListener('DOMContentLoaded', function() {

  // --- SETTINGS ---
  let coinsPerPage = 10; // Number of coins to load initially and per scroll
  let currentPage = 1; // Current page for API requests
  let isLoading = false; // Flag to prevent multiple fetches at once
  let isLastPage = false; // Flag to know when we've fetched all possible data
  let allFetchedCoins = []; // Stores all coins ever fetched
  const API_URL_BASE = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&sparkline=false";

  // --- HTML ELEMENTS ---
  const tbody = document.getElementById("cryptoTableBody");
  const searchInput = document.getElementById("cryptoSearchInput");
  const cryptoTableWrapper = document.querySelector(".crypto-table-wrapper"); // For scroll detection

  // To keep track of the current displayed coins for highlighting
  let displayedCoins = []; 
  let previousCoinData = {}; // Stores previous values for comparison

  /**
   * Constructs the full API URL with current pagination.
   */
  function getApiUrl() {
    return `${API_URL_BASE}&per_page=${coinsPerPage}&page=${currentPage}`;
  }

  /**
   * Fetches fresh data from the API and updates the table.
   */
  async function fetchAndRenderCryptoData(append = false) {
    if (isLoading || isLastPage) return; // Don't fetch if already loading or if it's the last page

    isLoading = true;
    tbody.classList.add('is-updating');

    const currentApiUrl = getApiUrl();

    try {
      const response = await fetch(currentApiUrl);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const newCoins = await response.json();

      if (newCoins.length === 0 || newCoins.length < coinsPerPage) {
        isLastPage = true; // We've fetched all available data
      }
      
      if (append) {
        // Append new coins to the existing list for infinite scroll
        allFetchedCoins = [...allFetchedCoins, ...newCoins];
      } else {
        // On initial load, replace the list
        allFetchedCoins = newCoins;
      }

      // Re-apply search filter to the newly fetched and combined data
      const currentQuery = searchInput.value.toLowerCase().trim();
      const filteredCoins = allFetchedCoins.filter(coin =>
        coin.name.toLowerCase().includes(currentQuery) ||
        coin.symbol.toLowerCase().includes(currentQuery)
      );
      
      // Pass the filtered coins to renderTable
      renderTable(filteredCoins, append); 
      
      currentPage++; // Move to the next page for the next scroll fetch

    } catch (error) {
      console.error("Error fetching crypto data:", error);
      if (!append) { // Only show error if it's an initial load
        tbody.innerHTML = `<tr><td colspan="4" class="error-state">Could not load data. Please try again later.</td></tr>`;
      }
    } finally {
      isLoading = false;
      tbody.classList.remove('is-updating');
      // If this was the last page, remove the 'loading-more' message
      if (isLastPage) {
        const loadingMoreRow = tbody.querySelector('.loading-more-row');
        if (loadingMoreRow) loadingMoreRow.remove();
      }
    }
  }

  /**
   * Renders the provided array of coin data into the HTML table.
   * 'append' is true if we are adding to existing rows (infinite scroll).
   */
  function renderTable(coinsToRender, append = false) {
    let tableContent = '';
    
    // Capture current values for comparison
    const currentCoinValues = {};
    coinsToRender.forEach(coin => {
      currentCoinValues[coin.id] = {
        price: coin.current_price,
        change_24h: coin.price_change_percentage_24h,
        market_cap: coin.market_cap
      };
    });

    // Highlight rows that have changed since the last render
    coinsToRender.forEach(coin => {
      const previousData = previousCoinData[coin.id];
      const isChanged = previousData && 
        (previousData.price !== coin.current_price || 
         previousData.change_24h !== coin.price_change_percentage_24h || 
         previousData.market_cap !== coin.market_cap);
      const highlightClass = isChanged ? 'row-changed' : '';

      const priceChange = coin.price_change_percentage_24h;
      const changeClass = priceChange >= 0 ? 'change-positive' : 'change-negative';
      const formattedPrice = coin.current_price < 0.10 
        ? coin.current_price.toPrecision(4) 
        : coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      // Determine arrow direction
      const arrow = priceChange >= 0 ? '&#9650;' : '&#9660;'; // Up arrow: &#9650;, Down arrow: &#9660;

      tableContent += `
        <tr class="${highlightClass}" data-coin-id="${coin.id}">
          <td class="coin-name align-left">
            <img src="${coin.image}" alt="${coin.name} logo" class="coin-logo">
            <span class="coin-main-name">${coin.name}</span>
            <span class="coin-symbol">${coin.symbol.toUpperCase()}</span>
          </td>
          <td class="align-right">$${formattedPrice}</td>
          <td class="align-right ${changeClass}">
            <span class="change-arrow">${arrow}</span> ${priceChange ? priceChange.toFixed(2) : '0.00'}%
          </td>
          <td class="align-right">$${coin.market_cap.toLocaleString()}</td>
        </tr>
      `;
    });

    if (append) {
      // If appending, add the new rows to the existing tbody
      tbody.innerHTML += tableContent;
    } else {
      // On initial load, replace all content
      tbody.innerHTML = tableContent;
    }

    // Store current data for comparison on the next refresh
    previousCoinData = currentCoinValues;

    // If we are at the last page, remove the "loading more" row if it exists
    if (isLastPage) {
      const loadingMoreRow = tbody.querySelector('.loading-more-row');
      if (loadingMoreRow) loadingMoreRow.remove();
    } else if (!isLoading && !isLastPage) {
      // Add a "loading more" row if we are not at the last page and not currently loading
      // This row will only appear when scrolling near the bottom
      const loadingMoreRow = document.createElement('tr');
      loadingMoreRow.classList.add('loading-more-row');
      loadingMoreRow.innerHTML = `<td colspan="4" class="loading-state">Loading more coins...</td>`;
      tbody.appendChild(loadingMoreRow);
    }
  }

  /**
   * Event listener for the search input field.
   */
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    const filteredCoins = allFetchedCoins.filter(coin =>
      coin.name.toLowerCase().includes(query) ||
      coin.symbol.toLowerCase().includes(query)
    );
    renderTable(filteredCoins, false); // Re-render from filtered list, not appending
  });

  /**
   * Handles scrolling to load more data.
   */
  function handleScroll() {
    // Check if user has scrolled near the bottom of the table wrapper
    const { scrollTop, scrollHeight, clientHeight } = cryptoTableWrapper;
    // Threshold of ~300px from the bottom before triggering load
    const scrollThreshold = 300; 

    if (scrollTop + clientHeight >= scrollHeight - scrollThreshold && !isLoading && !isLastPage) {
      fetchAndRenderCryptoData(true); // Fetch more data and append it
    }
  }

  // --- INITIALIZATION ---
  // 1. Load the data immediately when the page first loads
  fetchAndRenderCryptoData(false); // Initial load, not appending

  // 2. Set up an interval to refresh the data automatically (e.g., every minute)
  setInterval(refreshCryptoData, 60000); // 60 seconds

  // 3. Add scroll event listener for infinite loading
  cryptoTableWrapper.addEventListener("scroll", handleScroll);

});
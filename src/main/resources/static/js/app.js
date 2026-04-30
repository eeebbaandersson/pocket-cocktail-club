
let allDrinks = [];

async function loadAllDrinks() {
    try {
        const response = await fetch(`/api/drinks`);
        allDrinks = await response.json();
        console.log("Antal drinkar laddade i minnet:", allDrinks.length);
        updateButtonCounter();
    } catch (error) {
        console.error("Kunde inte ladda drink-data för räknaren",error)
    }
}

function searchDrinks() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim().toLocaleLowerCase();

    if (!query) return;

    let targetUrl = 'searchDisplay.html';

    if (query === 'random') {
        targetUrl += '?type=random';
    } else if (query.includes(',')) {
        const ingredients = query.split(',').map(s => s.trim()).filter(s => s !== "");
        targetUrl += `?ingredients=${encodeURIComponent(ingredients.join(','))}`;
    } else {
        targetUrl += `?query=${encodeURIComponent(query)}`;
    }

    window.location.href = targetUrl;
}

async function initSearchFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('query');
    const ingredients = params.get('ingredients');
    const type = params.get('type');

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        if (query) searchInput.value = query;
        else if (ingredients) searchInput.value = ingredients;
    }

    const spirit = params.get('spirit');
    const sweetness = params.get('sweetness');

    let apiUrl = '';

    if (type === 'random') {
        apiUrl = '/api/drinks/random';
    } else if (ingredients) {
        const list = ingredients.split(',');
        const apiParams = new URLSearchParams();
        list.forEach(name => apiParams.append('names',name));
        apiUrl = `/api/drinks/search/ingredients?${apiParams.toString()}`;
    } else if (query) {
        apiUrl = `/api/drinks/search/all?query=${encodeURIComponent(query)}`;
    } else if (spirit) {
        apiUrl = `/api/drinks/filter/combined?spirit=${encodeURIComponent(spirit)}&sweetness=${sweetness}`;
    }

    if (apiUrl) {
        await executeFetchAndDisplay(apiUrl);
    }
}

async function executeFetchAndDisplay(apiUrl) {
    const grid = document.querySelector('.recipe-grid');
    const countText = document.getElementById('resultCountText');
    if (!grid) return;

    try {
        if (countText) countText.innerText = "";

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Serverfel");
        const drinks = await response.json();

        const drinkList = Array.isArray(drinks) ? drinks : [drinks];

        if (countText) {
            const count = drinkList.length;
            if (count === 0) {
                countText.innerText = "No recipes found";
            } else {
                countText.innerText = count === 1 ? `1 recipe` : ` ${count} recipes`;
            }
        }

        renderDrinkGrid(drinkList, grid);

    } catch (error) {
        console.error("Fetch error:", error);
        grid.innerHTML = '<p>Something went wrong, Please try again.</p>';
    }

}

function renderDrinkGrid(drinks, container) {
    container.innerHTML = '';

    drinks.forEach(drink => {
        const card = document.createElement('article');
        card.className = 'recipe-card';

        const hasCategory = drink.categories && drink.categories.length > 0 && drink.categories[0].trim() != "";

        const categoryText = hasCategory ? drink.categories[0] : '&nbsp';

        // Builds drink card
        card.innerHTML = `
        <div class="card-image" style="background-image: url('${drink.imageUrl || 'assets/default-drink.jpg'}')"></div>
        <div class="card-content">
         <div class="card-tags">
               <div class="category-wrapper" style="margin-bottom: 8px; ${!hasCategory ? 'visibility: hidden;' : ''}">
                <span class="category-link">${categoryText}</span>
               </div>
            <h3>${drink.name}</h3>
            
           <div class="tag-row">Sweetness: ${drink.sweetnessScore}</div>
         </div>
        </div>
    `;

        card.addEventListener('click', () => {
            console.log("Visa detaljer för:", drink.id);
            const drinkName = encodeURIComponent(drink.name);
            window.location.href = `recipeDetail.html?name=${drinkName}`;
        });

        container.append(card);
    });
}

function updateLabelHighlights (value) {
    const labels = document.querySelectorAll('.slider-labels span:not(.spacer)');

    labels.forEach((label) => {
        if (label.innerText === value) {
            label.classList.add('active');
        } else {
            label.classList.remove('active');
        }
    });
}

function updateButtonCounter() {
    const showResultButton = document.getElementById('showResultsButton');
    if (!showResultButton || !allDrinks || allDrinks.length === 0) return;

    if (!currentSelectedSpirit) {
        showResultButton.innerText = "Show Matches";
        showResultButton.disabled = true;
        showResultButton.style.opacity = "0.5";
        return;
    }

    const matches = allDrinks.filter(drink => {
        let searchTerms = [];
        const selected = currentSelectedSpirit.toLowerCase();

        if (selected === "whiskey") {
            searchTerms = ["whiskey", "bourbon", "rye", "scotch", "rye whiskey", "scottish whiskey", "Single malt scottish whiskey"];
        } else if (selected === "rum") {
            searchTerms = ["white rum", "dark rum", "rum"];
        } else if (selected === "coffee") {
            searchTerms = ["espresso", "cold-brew", "coffee"];
        } else if (selected === "liqueur") {
            searchTerms = ["liqueur", "liqueur 43", "amaretto", "limoncello"];
        } else if (selected === "bitter") {
            searchTerms = ["aperol", "campari"];
        }
        else {
            searchTerms = [selected];
        }

        // Spirit Match
        const spiritMatch = drink.ingredients.some(ing => {
            const ingName = ing.name.toLowerCase();
            return searchTerms.some(term => {
                // Regex \b (word boundary)
                const regex = new RegExp(`\\b${term}\\b`, 'i');
                return regex.test(ingName);
            });
        });

        // Sweetness Match
        const sweetnessMatch = Number(drink.sweetnessScore) === Number(currentSweetnessValue);
        return spiritMatch && sweetnessMatch;
    });

    console.log(`Filter: ${currentSelectedSpirit} | Score: ${currentSweetnessValue}`);
    console.log("Matchade drinkar:", matches.map(d => d.name));


    if (matches.length > 0) {
        showResultButton.innerText = `Show Matches (${matches.length}) `;
        showResultButton.disabled = false;
        showResultButton.style.opacity = "1";
    } else {
        showResultButton.innerText = "No matches found"
        showResultButton.disabled = true;
        showResultButton.style.opacity = "0.3";
    }
}

let currentSelectedSpirit = null;
let currentSweetnessValue = 0;

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const recipeGrid = document.querySelector('.recipe-grid');
    const showResultButton = document.getElementById('showResultsButton');

    if (searchInput) {
        searchInput.focus();
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchDrinks();
        });

        const searchBtn = document.querySelector('.search-submit-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', searchDrinks);
        }
    }

    if (recipeGrid) {
        initSearchFromUrl();
    }

    if (showResultButton) {
        const spiritButtons = document.querySelectorAll('.spirit-btn');
        const slider = document.getElementById('sweetnessSlider');

        loadAllDrinks();

        if (slider) {
            currentSweetnessValue = slider.value;
            updateLabelHighlights(currentSweetnessValue);
            slider.addEventListener('input', function() {
                updateLabelHighlights(this.value);
                currentSweetnessValue = this.value;
                updateButtonCounter();
            });
        }

        spiritButtons.forEach(button => {
            button.addEventListener('click', function() {
                const wasAlreadyActive = this.classList.contains('active');

                spiritButtons.forEach(btn => btn.classList.remove('active'));

                if (wasAlreadyActive) {
                    currentSelectedSpirit = null;
                } else {
                    this.classList.add('active');
                    currentSelectedSpirit = this.innerText.trim().toLowerCase();
                }
                updateButtonCounter();
            });
        });

            showResultButton.addEventListener('click', () => {
                if (currentSelectedSpirit) {
                    const url = `searchDisplay.html?spirit=${encodeURIComponent(currentSelectedSpirit)}&sweetness=${currentSweetnessValue}`;
                    window.location.href = url;
                }
            });
    }

});

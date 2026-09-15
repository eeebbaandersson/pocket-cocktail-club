let allDrinks = [];
let currentSelectedSpirit = null;
let currentSweetnessValue = 0;

document.addEventListener('DOMContentLoaded', async () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-submit-btn');
    const showResultButton = document.getElementById('showResultsButton');
    const surpriseBtn = document.getElementById('randomBtn');
    const spiritButtons = document.querySelectorAll('.spirit-btn');
    const slider = document.getElementById('sweetnessSlider');
    const sortSelect = document.getElementById('sortSelect');

    // 1. Ladda alla drinkar direkt när sidan startar
    await loadAllDrinks();

    // 2. Sökfält med Enter eller Klick (Söker i realtid på sidan)
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }

    // 3. Slider-hantering
    if (slider) {
        currentSweetnessValue = slider.value;
        updateLabelHighlights(currentSweetnessValue);
        slider.addEventListener('input', function () {
            updateLabelHighlights(this.value);
            currentSweetnessValue = this.value;
            updateButtonCounter();
        });
    }

    // 4. Spritknapp-hantering
    spiritButtons.forEach(button => {
        button.addEventListener('click', function () {
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

    // 5. Klick på "Show Matches" (Filter-sökning på samma sida)
    if (showResultButton) {
        showResultButton.addEventListener('click', () => {
            if (currentSelectedSpirit) {
                const matches = getFilteredMatches();
                renderDrinkGrid(matches);
                scrollToResults();
            }
        });
    }

    if (surpriseBtn) {
        surpriseBtn.addEventListener('click', handleRandomDrink);
    }

    // 6. Sortering i dropdown
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortAndRenderCurrent(e.target.value);
        });
    }

    const categoryChips = document.querySelectorAll('.category-chip');

    categoryChips.forEach(chip => {
        chip.addEventListener('click', function() {
            const selectedCategory = this.dataset.category.toLowerCase();
            const wasActive = this.classList.contains('active');

            // Nollställ aktiva chips
            categoryChips.forEach(c => c.classList.remove('active'));

            if (wasActive) {
               currentDisplayedDrinks = [...allDrinks];
               const currentSort = sortSelect ? sortSelect.value : 'name-asc';
               sortAndRenderCurrent(currentSort);
            } else {
                this.classList.add('active');

                // Filtrera direkt på category-arrayen i drinkobjekten
                const filtered = allDrinks.filter(drink =>
                    drink.categories && drink.categories.some(c => c.toLowerCase() === selectedCategory)
                );

               currentDisplayedDrinks = [...filtered];

               const currentSort = sortSelect ? sortSelect.value : 'name-asc';

               sortAndRenderCurrent(currentSort);

               const resultsText = document.getElementById('resultsText');
               if (resultsText) {
                   resultsText.innerText = `Category: ${this.innerText} (${filtered.length})`;
               }
            }
        });
    });
});

/* --- API & DATA HÄMTNING --- */

async function loadAllDrinks() {
    try {
        const response = await fetch('/api/drinks');
        if (!response.ok) throw new Error("Kunde inte hämta drinkar");
        allDrinks = await response.json();

        currentDisplayedDrinks = [...allDrinks];

        // Visa alla drinkar från start (A-Ö)
        sortAndRenderCurrent('name-asc');
        updateButtonCounter();
    } catch (error) {
        console.error("Fel vid laddning av drinkar:", error);
        const grid = document.getElementById('drinkDisplay');
        if (grid) grid.innerHTML = '<p class="error-msg">Det gick inte att ladda recepten.</p>';
    }
}

/* --- SÖK & FILTERLOGIK --- */

function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    const rawQuery = searchInput.value.trim().toLowerCase();

    if (!rawQuery) {
        renderDrinkGrid(allDrinks);
        return;
    }
    const searchTerms = rawQuery
            .split(',')
            .map(term => term.trim())
            .filter(term => term.length > 0);

        const results = allDrinks.filter(drink => {
            return searchTerms.every(term => {
                const nameMatch = drink.name.toLowerCase().includes(term);
                const categoryMatch = drink.categories && drink.categories.some(c => c.toLowerCase().includes(term));
                const ingredientMatch = drink.ingredients && drink.ingredients.some(i => i.name.toLowerCase().includes(term));

                return nameMatch || categoryMatch || ingredientMatch;
            });
        });

    renderDrinkGrid(results, `Search result for "${rawQuery}"`);
    scrollToResults();
}

function getFilteredMatches() {
    if (!currentSelectedSpirit) return allDrinks;

    return allDrinks.filter(drink => {
        let searchTerms = [];
        const selected = currentSelectedSpirit.toLowerCase();

        if (selected === "whiskey") {
            searchTerms = ["whiskey", "bourbon", "rye", "scotch", "rye whiskey", "scottish whiskey", "single malt scottish whiskey"];
        } else if (selected === "rum") {
            searchTerms = ["white rum", "dark rum", "rum"];
        } else if (selected === "coffee") {
            searchTerms = ["espresso", "cold-brew", "coffee"];
        } else if (selected === "liqueur") {
            searchTerms = ["liqueur", "liqueur 43", "amaretto", "limoncello"];
        } else if (selected === "bitter") {
            searchTerms = ["aperol", "campari"];
        } else {
            searchTerms = [selected];
        }

        const spiritMatch = drink.ingredients.some(ing => {
            const ingName = ing.name.toLowerCase();
            return searchTerms.some(term => new RegExp(`\\b${term}\\b`, 'i').test(ingName));
        });

        const sweetnessMatch = Number(drink.sweetnessScore) === Number(currentSweetnessValue);
        return spiritMatch && sweetnessMatch;
    });
}

/* --- PRESENTATION & RENDERING --- */

let currentDisplayedDrinks = [];

function renderDrinkGrid(drinks, customTitle = null) {
    currentDisplayedDrinks = [...drinks];
    const grid = document.getElementById('drinkDisplay');
    const resultsText = document.getElementById('resultsText');

    if (!grid) return;
    grid.innerHTML = '';

    // Uppdatera status-text
    if (resultsText) {
        if (customTitle) {
            resultsText.innerText = `${customTitle} (${drinks.length})`;
        } else if (currentSelectedSpirit) {
            resultsText.innerText = `Result for ${currentSelectedSpirit.toUpperCase()} with (sweetness: ${currentSweetnessValue})`;
        } else {
            resultsText.innerText = `Recipes (${drinks.length})`;
        }
    }

    if (drinks.length === 0) {
        grid.innerHTML = '<p class="no-results">No recipes found for your search.</p>';
        return;
    }

    drinks.forEach(drink => {
        const card = document.createElement('article');
        card.className = 'recipe-card';

        const hasCategory = drink.categories && drink.categories.length > 0 && drink.categories[0].trim() !== "";
        const categoryText = hasCategory ? drink.categories[0] : '&nbsp;';

        const ingredientsFormatted = drink.ingredients && drink.ingredients.length > 0
            ? drink.ingredients.map(ing => ing.name).join(' – ') : '';


        card.innerHTML = `
            <div class="card-image" style="background-image: url('${drink.imageUrl || 'assets/default-drink.jpg'}')"></div>
            <div class="card-content">
                <div class="category-wrapper" style="${!hasCategory ? 'visibility: hidden;' : ''}">
                    <span class="category-badge">${categoryText}</span>
                </div>
                <h3>${drink.name}</h3>
                
                <p class="card-ingredients">${ingredientsFormatted}</p>
                
                <div class="tag-row">Sweetness: ${drink.sweetnessScore}</div>
            </div>
        `;

        card.addEventListener('click', () => {
            const drinkName = encodeURIComponent(drink.name);
            window.location.href = `recipeDetail.html?name=${drinkName}`;
        });

        grid.append(card);
    });
}

function sortAndRenderCurrent(sortType) {
    let sorted = [...currentDisplayedDrinks];

    if (sortType === 'name-asc') {
        sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === 'name-desc') {
        sorted.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortType === 'sweetness-asc') {
        sorted.sort((a, b) => a.sweetnessScore - b.sweetnessScore);
    } else if (sortType === 'sweetness-desc') {
        sorted.sort((a, b) => b.sweetnessScore - a.sweetnessScore);
    }

    renderDrinkGrid(sorted);
}

function handleRandomDrink() {
    if (!allDrinks || allDrinks.length === 0) return;

    const randomIndex = Math.floor(Math.random() * allDrinks.length);
    const randomDrink = allDrinks[randomIndex];

    renderDrinkGrid([randomDrink], `Surprise Result: ${randomDrink.name}`);

    scrollToResults();
}

/* --- HJÄLP-FUNKTIONER --- */

function updateLabelHighlights(value) {
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

    const matches = getFilteredMatches();

    if (matches.length > 0) {
        showResultButton.innerText = `Show Matches (${matches.length})`;
        showResultButton.disabled = false;
        showResultButton.style.opacity = "1";
    } else {
        showResultButton.innerText = "No matches found";
        showResultButton.disabled = true;
        showResultButton.style.opacity = "0.3";
    }
}

function scrollToResults() {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.scrollIntoView({behavior: 'smooth'});
    }
}

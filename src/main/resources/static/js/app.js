
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

    // Skapa bas-URL:en för första sidan
    let targetUrl = 'searchDisplay.html';

    if (query === 'random') {
        // Specialfall för random-sökning
        targetUrl += '?type=random';
    } else if (query.includes(',')) {
        // Ingredienssökning (separerat med ,)
        const ingredients = query.split(',').map(s => s.trim()).filter(s => s !== "");
        targetUrl += `?ingredients=${encodeURIComponent(ingredients.join(','))}`;
    } else {
        // Vanlig textbaserad sökning
        targetUrl += `?query=${encodeURIComponent(query)}`;
    }

    // Skicka användaren till korrekt vy
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

    // Logik för att välja RÄTT API-endpoint
    if (type === 'random') {
        apiUrl = '/api/drinks/random';
    } else if (ingredients) {
        // Bygg om ingredienserna till api-formatet (names=gin&names=lime)
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

        // Hantera både enstaka drinkar (random) och listor
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
    container.innerHTML = ''; // Rensar placeholders

    // Ta bort denna rad då felmedelandet blir samma som redan visas från countText i executeFetchAndDisplay()
    // if (drinks.length === 0) {
    //     container.innerHTML = '<p class="no-results">No cocktails matched your search.</p>';
    //     return;
    // }

    drinks.forEach(drink => {
        const card = document.createElement('article');
        card.className = 'recipe-card';

        // Bygger kort med den nya designen
        card.innerHTML = `
        <div class="card-image" style="background-image: url('${drink.imageUrl || 'assets/default-drink.jpg'}')"></div>
        <div class="card-content">
            <h3>${drink.name}</h3>
            <div class="card-tags">
                <div class="tag-row">${drink.categories[0] || 'Cocktail'}</div>
                 <div class="tag-row">Sweetness: ${drink.sweetnessScore}</div>
            </div>
        </div>
       
    `;

        card.addEventListener('click', () => {
            console.log("Visa detaljer för:", drink.id);
            // Addera länk här senare till den egna drinksidan?
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
    // Avbryt om knappet eller datan intr laddats ännu
    if (!showResultButton || !allDrinks || allDrinks.length === 0) return;

    // Om ingen spritsort är vald -> Visa neutral text/inaktiverad knapp
    if (!currentSelectedSpirit) {
        showResultButton.innerText = "Show Matches";
        showResultButton.disabled = true;
        showResultButton.style.opacity = "0.5";
        return;
    }

    // Filtrerar listan med drinkar
    const matches = allDrinks.filter(drink => {
        let searchTerms = [];
        const selected = currentSelectedSpirit.toLowerCase();

        // Filtreringslogik från DrinkController
        if (selected === "whiskey") {
            searchTerms = ["whiskey", "bourbon", "rye", "scotch", "rye whiskey", "scottish whiskey", "Single malt scottish whiskey"];
        } else if (selected === "rum") {
            searchTerms = ["white rum", "dark rum", "rum"];
        } else if (selected === "coffee") {
            searchTerms = ["espresso", "cold-brew", "coffee"];
        } else if (selected === "liqueur") {
            searchTerms = ["liqueur", "liqueur 43", "amaretto", "limoncello"];
        }
        else {
            searchTerms = [selected];
        }

        // Spirit Match --> Leta efter hela ordet för att undvika "Ginger" vid "Gin"-sökning
        const spiritMatch = drink.ingredients.some(ing => {
            const ingName = ing.name.toLowerCase();
            return searchTerms.some(term => {
                // Regex \b (word boundary) --> Se till att ordet matchar exakt
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


    // Uppdaterar knappen dynamiskt
    if (matches.length > 0) {
        // Träff: Aktivera
        showResultButton.innerText = `Show Matches (${matches.length}) `;
        showResultButton.disabled = false;
        showResultButton.style.opacity = "1";
    } else {
        // Ingen träff: avaktivera
        showResultButton.innerText = "No matches found"
        showResultButton.disabled = true;
        showResultButton.style.opacity = "0.3"; // Gör knappen blekare om inga träffar hittades
    }
}

let currentSelectedSpirit = null;
let currentSweetnessValue = 0;

document.addEventListener('DOMContentLoaded', () => {
    // Hämta alla element en gång när sidan laddats
    const searchInput = document.getElementById('searchInput');
    const recipeGrid = document.querySelector('.recipe-grid');
    const showResultButton = document.getElementById('showResultsButton');

    // Gemensam logik (Sökfältet på båda sidorna)
    if (searchInput) {
        searchInput.focus();  // Sätter markör direkt i sökfältet
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchDrinks();
        });

        const searchBtn = document.querySelector('.search-submit-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', searchDrinks);
        }
    }

    // Specifik logik för RESULTATSIDAN
    if (recipeGrid) {
        initSearchFromUrl();
    }

    // Specifikk logik för STARTSIDAN/index.html
    if (showResultButton) {
        const spiritButtons = document.querySelectorAll('.spirit-btn');
        const slider = document.getElementById('sweetnessSlider');

        loadAllDrinks(); // Endast på startsidan, för att kunna visa existerande recept i utvecklarläge?

        // Logik för sweetness-slider
        if (slider) {
            currentSweetnessValue = slider.value; // Sätter startvärde för sötma direkt från sliderns HTML-värde
            updateLabelHighlights(currentSweetnessValue);
            slider.addEventListener('input', function() {
                updateLabelHighlights(this.value);
                currentSweetnessValue = this.value;
                updateButtonCounter();
            });
        }

        // Logik för sprit-knappar
        spiritButtons.forEach(button => {
            button.addEventListener('click', function() {
                const wasAlreadyActive = this.classList.contains('active'); // Kontrollerar om en knapp redan aktiv

                spiritButtons.forEach(btn => btn.classList.remove('active'));  // Tar bort 'active' från ALLA knappar (nollställning)

                if (wasAlreadyActive) {
                    currentSelectedSpirit = null;  // Om den redan var aktiv --> Avmarkera/sätt till null
                } else {
                    this.classList.add('active');  // Om den inte var aktiv --> Aktivera knappen
                    currentSelectedSpirit = this.innerText.trim().toLowerCase();
                }
                updateButtonCounter();
            });
        });

        // När knapp = active --> visa resultat från sprit-knapp/sweetness-slidern
            showResultButton.addEventListener('click', () => {
                if (currentSelectedSpirit) {
                    const url = `searchDisplay.html?spirit=${encodeURIComponent(currentSelectedSpirit)}&sweetness=${currentSweetnessValue}`;
                    window.location.href = url;
                }
            });
    }

});




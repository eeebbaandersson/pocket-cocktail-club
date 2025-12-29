

async function getRandomDrink() {
    try {
        const response = await fetch('/api/drinks/random');
        const drink = await response.json();
        displayDrinks([drink]);
    } catch (error) {
        console.error("Fel vid hämtning av slumpad drink:", error);
    }
}

async function searchDrinks() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim().toLocaleLowerCase();

    if (!query) return;

    // Om användaren skriver "random"--> Slumpa fram en drink
    if (query === 'random') {
        await getRandomDrink();
        searchInput.value = '';
        return;
    }

    let url = '';

    if (query.includes(',')) {
        const ingredients = query.split(',').map(s => s.trim()).filter(s => s !== "");
        const params = new URLSearchParams();
        ingredients.forEach(name => params.append('names', name));

        url = `/api/drinks/search/ingredients?${params.toString()}`;
    } else {
        url = `/api/drinks/search/all?query=${encodeURIComponent(query)}`
    }
    console.log("Anropar URL;", url); // För felsökning

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Serverfel");
        const drinks = await response.json();

        if (drinks.length === 0) {
            document.getElementById('drinkDisplay').innerHTML = '<p>Inga drinkar hittades...</p>';
        } else {
            displayDrinks(drinks);
        }
    } catch (error) {
        console.error("Error during search:", error);
    }
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

function displayDrinks(drinks) {
    const display = document.getElementById('drinkDisplay');
    display.innerHTML = '';

    drinks.forEach(drink => {
        const card = document.createElement('div');
        card.className = 'drink-card';
        card.innerHTML = `
            <h2>${drink.name}</h2>
            <p><strong>Category:</strong> ${drink.categories.join(', ')}</p>
            <p><strong>Sweet-/sourness:</strong> ${drink.sweetnessScore}</p>
            <h3>Ingredients:</h3>
            <ul>
                ${drink.ingredients.map(ing => `<li>${ing.quantity} ${ing.unit} ${ing.name}</li>`).join('')}
            </ul>
            <h3>Instructions:</h3>
            <p>${drink.instructions}</p>
        `;
        display.append(card);
    });
}

let currentSelectedSpirit = null;
let currentSweetnessValue = 0;

async function combinedFilterSearch() {
    if (!currentSelectedSpirit) {
        console.log("Ingen spritsort vald - avbryter sökning");
        return;
    }

    const url = `/api/drinks/filter/combined?spirit=${encodeURIComponent(currentSelectedSpirit)}&sweetness=${currentSweetnessValue}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Serverfel vid filtrering");

        const drinks = await  response.json();
        displayDrinks(drinks);
    } catch (error) {
        console.log("Fel i kombinerad sökning:", error);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    // Hämta alla element en gång när sidan laddats
    const searchInput = document.getElementById('searchInput');
    const spiritButtons = document.querySelectorAll('.spirit-btn');
    const slider = document.getElementById('sweetnessSlider');

    // Sätter markör i sökfät direkt
    if (searchInput) searchInput.focus();


    if (slider) {
        // Sätter startvärde för sötma direkt från sliderns HTML-värde
        currentSweetnessValue = slider.value;
        updateLabelHighlights(currentSweetnessValue);
    }


    // --Sökning 1: FRI SÖKNING (Namn/Kategori/Ingredienser)--
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchDrinks();
            }
        });
    }

    // --Sökning 2: KOMBINERAD FILTRERING (Sprit + Sötma)--

    // Lyssnar på sprit-knapparna
    spiritButtons.forEach(button => {
        button.addEventListener('click', function() {

            // Kontrollerar om en knapp redan aktiv/klickad på
            const wasAlreadyActive = this.classList.contains('active');

            // Tar bort 'active' från ALLA knappa (nollställning)
            spiritButtons.forEach(btn => btn.classList.remove('active'));

            if (wasAlreadyActive) {
                // Om den redan var aktiv --> Avmerker/sätt till null
                currentSelectedSpirit = null;
            } else
                // Om den inte var aktiv --> Aktivera knappen
                this.classList.add('active');
            currentSelectedSpirit = this.innerText.trim().toLocaleLowerCase();

            // Utför sökningen
            combinedFilterSearch();
        });
    });

    // Lyssnar på slider-rörelser
    if (slider) {
        slider.addEventListener('input', function() {

            // Uppdaterar tillstånd
            updateLabelHighlights(this.value);

            // Uppdaterar
            currentSweetnessValue = this.value;

            // Kör kombinerad sökmetod
            combinedFilterSearch();
        });
    }
});





document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');

    // Sätter markören i sökfältet direkt
    searchInput.focus();

    searchInput.addEventListener('keypress', (e) => {
        if (e.key == 'Enter') {
            searchDrinks();
        }

    });

});


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
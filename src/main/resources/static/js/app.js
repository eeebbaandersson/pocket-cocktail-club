
console.log("JavaScript-filen är laddad!");
alert("JS fungerar!");


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
    const query = document.getElementById('searchInput').value;
    if (!query) return;

    try {
        const response = await fetch(`/api/drinks?name=${encodeURIComponent(query)}`);
        const drinks = await response.json();
        displayDrinks(drinks);
    } catch (error) {
        console.error("Fel vid sökning:", error);
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
            <p><strong>Sweetness:</strong> ${drink.sweetnessScore}</p>
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
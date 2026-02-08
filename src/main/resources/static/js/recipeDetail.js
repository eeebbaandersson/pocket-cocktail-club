document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const drinkName = params.get('name');
    const content = document.getElementById('recipeContent');

    if (!drinkName) return;

    try {
        // Använder redan existerande endpoint för sökning via namn
        const response = await fetch(`/api/drinks?name=${encodeURIComponent(drinkName)}`);
        const drinks = await response.json();
        const drink = drinks[0];

        renderFullRecipe(drink);
    } catch (error) {
        content.innerHTML = "<p>Could not load recipe.</p>";
    }
});

function renderFullRecipe(drink) {
    const content = document.getElementById('recipeContent');

    content.innerHTML = `
    <div class="recipe-header">
            <div class="recipe-title-section">
                <h2>${drink.name}</h2>
                <p class="category-label">${drink.categories.join(' • ')}</p>
            </div>
        </div>
        
        <div class="recipe-grid-layout">
            <div class="ingredients-list">
                <h3>Ingredients</h3>
                <ul>
                    ${drink.ingredients.map(ing => `
                        <li><strong>${ing.quantity} ${ing.unit}</strong> ${ing.name}</li>
                    `).join('')}
                </ul>
            </div>
            <div class="instructions-text">
                <h3>Instructions</h3>
                <p>${drink.instructions}</p>
                <div class="sweetness-badge">Sweetness Score: ${drink.sweetnessScore}</div>
            </div>
        </div>
    `;
}
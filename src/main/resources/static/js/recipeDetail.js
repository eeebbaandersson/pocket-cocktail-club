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

    const hasCategory = drink.categories && drink.categories.length > 0;

    const categoryDisplay = hasCategory ? drink.categories.join(' |') : '&nbsp';

    const instructionSteps = drink.instructions
        .split('.')
        .map(step => step.trim())
        .filter(step => step.length > 0);

    content.innerHTML = `
    <div class="recipe-header">
            <div class="recipe-title-section">
                <h2>${drink.name}</h2>
                
          <div class="category-wrapper">
                ${hasCategory
        ? `<a href="searchDisplay.html?query=${encodeURIComponent(drink.categories[0])}" class="category-link">${categoryDisplay}</a>`
        : `<span class="category-link" style="visibility: hidden;">&nbsp;</span>`
    }
            </div>

            <div class="sweetness-wrapper">
                <span class="sweetness-badge">Sweetness: ${drink.sweetnessScore}</span>
            </div>
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
            <ol>
                ${instructionSteps.map(step => `
                    <li>${step}.</li>
                `).join('')}
            </ol>
        </div>
    </div>
    `;
}

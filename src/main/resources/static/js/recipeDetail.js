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

    const instructionSteps = drink.instructions
        .split('.')
        .map(step => step.trim())
        .filter(step => step.length > 0);

    const words = drink.name.split(' ');
    const formattedTitle = words.length > 2
        ? `${words[0]} ${words[1]}<br>${words.slice(2).join(' ')}`
        : drink.name;

    content.innerHTML = `
    <div class="recipe-header">
        <div class="recipe-title-section">
            <h2 class="recipe-title">${formattedTitle}</h2>
            
            <div class="category-wrapper">
                ${hasCategory
        ? drink.categories.map(cat => `
                        <a href="index.html?query=${encodeURIComponent(cat)}" class="category-link">${cat}</a>
                      `).join('')
        : ''
    }
            </div>

            <div class="sweetness-wrapper" style="margin-top: 8px;">
                <span class="sweetness-pill">Sweetness: ${drink.sweetnessScore}</span>
            </div>
        </div>
    </div>
    
    <div class="recipe-grid-layout">
        <div class="ingredients-list">
            <h3>Ingredients</h3>
            <ul>
                ${drink.ingredients.map(ing => `
                    <li>
                        <span class="ingredient-measure">${ing.quantity} ${ing.unit}</span>
                        <span class="ingredient-name">${ing.name}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
        <div class="instructions-text">
            <h3>How to mix</h3>
            <ol>
                ${instructionSteps.map(step => `
                    <li>${step}.</li>
                `).join('')}
            </ol>
        </div>
    </div>
    `;
}

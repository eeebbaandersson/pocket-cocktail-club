package org.example.drinkapi.dto;

import java.util.List;

public class DrinkDTO {
    private String name;
    private Integer sweetnessScore;;
    private List<String> categories;
    private String instructions;
    private List<DrinkIngredientDTO> ingredients;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getSweetnessScore() {
        return sweetnessScore;
    }

    public void setSweetnessScore(Integer sweetnessScore) {
        this.sweetnessScore = sweetnessScore;
    }

    public List<String> getCategories() {
        return categories;
    }

    public void setCategories(List<String> categories) {
        this.categories = categories;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public List<DrinkIngredientDTO> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<DrinkIngredientDTO> ingredients) {
        this.ingredients = ingredients;
    }
}

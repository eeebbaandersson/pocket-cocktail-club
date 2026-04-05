package org.example.drinkapi.mapper;

import org.example.drinkapi.dto.DrinkDTO;
import org.example.drinkapi.dto.DrinkImportDTO;
import org.example.drinkapi.dto.DrinkIngredientDTO;
import org.example.drinkapi.dto.IngredientImportDTO;
import org.example.drinkapi.model.Category;
import org.example.drinkapi.model.Drink;
import org.example.drinkapi.model.DrinkIngredient;
import org.example.drinkapi.model.Ingredient;
import org.example.drinkapi.repository.CategoryRepository;
import org.example.drinkapi.repository.IngredientRepository;
import org.springframework.stereotype.Component;

@Component
public class DrinkMapper {

    private final CategoryRepository  categoryRepository;
    private final IngredientRepository ingredientRepository;

    public DrinkMapper(CategoryRepository categoryRepository, IngredientRepository ingredientRepository) {
        this.categoryRepository = categoryRepository;
        this.ingredientRepository = ingredientRepository;
    }


    // Entity --> DTO
    public DrinkDTO convertToDTO(Drink drink) {
        DrinkDTO dto = new DrinkDTO();
        dto.setName(drink.getName());
        dto.setSweetnessScore(drink.getSweetnessScore());
        dto.setInstructions(drink.getInstructions());

        dto.setCategories(drink.getCategories().stream()
                .map(Category::getName)
                .toList());

        dto.setIngredients(drink.getDrinkIngredients().stream()
                .map(di -> {
                    DrinkIngredientDTO idto = new DrinkIngredientDTO();
                    idto.setName(di.getIngredient().getName());
                    idto.setQuantity(di.getQuantity());
                    idto.setUnit(di.getUnit());
                    return idto;
                }).toList());

        return dto;
    }

    // DTO --> Entity
    public Drink convertToEntity(DrinkImportDTO dto) {
        Drink drink = new Drink();
        drink.setName(dto.getName());
        drink.setInstructions(dto.getInstructions());
        drink.setSweetnessScore(dto.getSweetnessScore());

        // Handle categories
        drink.setCategories(dto.getCategoryNames().stream()
                .map(name -> categoryRepository.findByName(name)
                        .orElseGet(() -> {
                    Category category = new Category();
                    category.setName(name);
                    return categoryRepository.save(category);
        }))
                        .toList());

        // Handle ingredients
        drink.setDrinkIngredients(dto.getIngredients().stream()
                .map(ingDto -> createDrinkIngredient(drink, ingDto))
                .toList());

        return drink;
    }

    private DrinkIngredient createDrinkIngredient(Drink drink, IngredientImportDTO ingDto) {
        Ingredient ingredient = ingredientRepository.findByName(ingDto.getName())
                .orElseGet(() -> {
                    Ingredient newIngredient = new Ingredient();
                    newIngredient.setName(ingDto.getName());
                    newIngredient.setAlcoholic(ingDto.isAlcoholic());
                    return ingredientRepository.save(newIngredient);

                });
        DrinkIngredient drinkIngredient = new DrinkIngredient();
        drinkIngredient.setDrink(drink);
        drinkIngredient.setIngredient(ingredient);
        drinkIngredient.setQuantity(ingDto.getQuantity());
        drinkIngredient.setUnit(ingDto.getUnit());
        return drinkIngredient;

    }
}

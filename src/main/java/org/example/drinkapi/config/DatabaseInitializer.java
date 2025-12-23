package org.example.drinkapi.config;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import org.example.drinkapi.model.Category;
import org.example.drinkapi.model.Drink;
import org.example.drinkapi.model.DrinkIngredient;
import org.example.drinkapi.model.Ingredient;
import org.example.drinkapi.repository.CategoryRepository;
import org.example.drinkapi.repository.DrinkRepository;
import org.example.drinkapi.repository.IngredientRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class DatabaseInitializer {

    @Bean
    CommandLineRunner initDatabase(
            DrinkRepository drinkRepository,
            IngredientRepository ingredientRepository,
            CategoryRepository categoryRepository) {
        return args -> {
            if (drinkRepository.count() == 0) {
                System.out.println("Database is empty. Starting import from JSON-file...");

                ObjectMapper mapper = new ObjectMapper();

                mapper.configure(JsonParser.Feature.ALLOW_COMMENTS, true);

                TypeReference<List<DrinkImportDTO>> typeReference = new TypeReference<>() {};

                try (InputStream inputStream = getClass().getResourceAsStream("/drink_data.json")) {
                    if (inputStream == null) {
                        System.out.println("Could not find drink_data.json");
                        return;
                    }
                 List<DrinkImportDTO> dtos = mapper.readValue(inputStream, typeReference);

                 for (DrinkImportDTO dto : dtos) {
                     // Skapa Drink-objektet
                     Drink drink = new Drink();
                     drink.setName(dto.getName());
                     drink.setInstructions(dto.getInstructions());
                     drink.setSweetnessScore(dto.getSweetnessScore());

                     // Hantera Kategorier - Mappar String från JSON-fil till Category-objekt
                     List<Category> categories = new ArrayList<>();
                     for (String categoryName : dto.getCategoryNames()) {
                         Category category = categoryRepository.findByName(categoryName)
                                 .orElseGet(() -> {
                                     Category newCategory = new Category();
                                     newCategory.setName(categoryName);
                                     return categoryRepository.save(newCategory);
                                 });
                         categories.add(category);
                     }
                     drink.setCategories(categories);

                     // Hantera Ingredienser via kopplingstabellen
                     List<DrinkIngredient> drinkIngredients = new ArrayList<>();
                     for (IngredientImportDTO ingDto : dto.getIngredients()) {
                         // Hämta eller skapa bas-ingrediensen (ex. Gin)
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

                         drinkIngredients.add(drinkIngredient);
                     }
                     drink.setDrinkIngredients(drinkIngredients);
                     drinkRepository.save(drink);
                 }
                    System.out.println(" Import finished. Number of imported drinks: " + dtos.size());
                } catch (Exception e){
                    System.out.println("Error during import: " + e.getMessage());
                }
            }
        };

    }

    @Data
    static class DrinkImportDTO {
        private String name;
        @JsonProperty("sweetness_score")
        private int sweetnessScore;

        @JsonProperty("categories")
        private List<String> categoryNames;

        private List<IngredientImportDTO> ingredients;
        private String instructions;
    }

    @Data
    static class IngredientImportDTO {
        private String name;
        private double quantity;
        private String unit;
        @JsonProperty("is_alcoholic")
        private boolean alcoholic;
    }
}


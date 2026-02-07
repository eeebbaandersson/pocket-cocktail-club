package org.example.drinkapi.controller;

import org.example.drinkapi.dto.DrinkDTO;
import org.example.drinkapi.dto.DrinkIngredientDTO;
import org.example.drinkapi.model.Category;
import org.example.drinkapi.model.Drink;
import org.example.drinkapi.repository.DrinkRepository;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/drinks")
public class DrinkController {

    private final DrinkRepository drinkRepository;

    public DrinkController(DrinkRepository drinkRepository) {
        this.drinkRepository = drinkRepository;
    }

    // Standard: Hämta alla eller sök på namn via api/drinks?name=Gimlet
    @GetMapping
    public List<DrinkDTO> getDrinks(@RequestParam(required = false) String name) {
        List<Drink> drinks;
      if (name != null) {
          drinks = drinkRepository.findByNameContainingIgnoreCase(name);
      } else {
          drinks = drinkRepository.findAll();
      }
      return drinks.stream().map(this::convertToDTO).toList();
    }

    // Sök via kategori /api/drinks/category/Classic
    @GetMapping("/category/{category}")
    public List<DrinkDTO> getByCategory(@PathVariable String category) {
        return drinkRepository.findByCategoriesNameIgnoreCase(category)
                .stream().map(this::convertToDTO).toList();
    }

    @GetMapping("/search/all")
    public List<DrinkDTO> universalSearch(@RequestParam String query) {
        // Hämtar entiteter från databasen via repository
        // Skickar 'query' till både namn- och kategori-sök
        List<Drink> drinks = drinkRepository.findByNameContainingIgnoreCaseOrCategoriesNameIgnoreCase(query, query);

        // Mappa/omvandla entiteterna till DTO:s innan de skickas till frontend
        return drinks.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // Sök via Ingrediens; /api/drinks/ingredient/Gin
    @GetMapping("/ingredient/{ingredient}")
    public List<DrinkDTO> getByIngredient(@PathVariable String ingredient) {
        return drinkRepository.findByDrinkIngredientsIngredientNameIgnoreCase(ingredient)
                .stream().map(this::convertToDTO).toList();
    }

    // Sök via kombination /api/drinks/search?spirit=Gin&sweetness=-2
    @GetMapping("/filter/combined")
    public List<DrinkDTO> getSpiritAndSweetness(
            @RequestParam String spirit,
            @RequestParam int sweetness) {

        // Tillfällig lösning för att inte behöva vara super specifik när man anger spritsort i sökning/trycker på knapparna
        List<String> searchTerms = new ArrayList<>();

        if (spirit.equalsIgnoreCase("whiskey")) {
            searchTerms.addAll(Arrays.asList("whiskey", "bourbon", "rye", "scotch", "rye whiskey", "scottish whiskey", "Single malt scottish whiskey"));
        } else if (spirit.equalsIgnoreCase("rum")) {
            searchTerms.addAll(Arrays.asList("white rum", "dark rum", "rum"));
        } else if (spirit.equalsIgnoreCase("coffee")) {
            searchTerms.addAll(Arrays.asList("espresso", "cold-brew", "coffee"));
        } else if (spirit.equalsIgnoreCase("liqueur")) {
            searchTerms.addAll(Arrays.asList("liqueur", "liqueur 43", "amaretto", "limoncello"));
        } else if (spirit.equalsIgnoreCase("bitter")) {
            searchTerms.addAll(Arrays.asList("aperol", "campari"));
        }

        else {
            searchTerms.add(spirit);
        }

        return drinkRepository.findBySweetnessScoreAndDrinkIngredientsIngredientNameInIgnoreCase(sweetness,searchTerms)
                .stream().map(this::convertToDTO).toList();
    }

    // Sök via flera ingredienser
    @GetMapping("/search/ingredients")
    public List<DrinkDTO> getByMultipleIngredients(@RequestParam List<String> names) {
        List<String> lowerCaseNames = names.stream()
                .map(String::toLowerCase)
                .toList();

        return drinkRepository.findByAllIngredients(lowerCaseNames,(long) names.size())
                .stream().map(this::convertToDTO).toList();

    }

    // Generera en slumpad drink /api/drinks/random
    @GetMapping("/random")
    public DrinkDTO getRandom() {
        return drinkRepository.findByRandomDrink()
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Found no drinks"));
    }

    // Konverterar entiteter till DTO för att bara behålla/presentera relevant data
    private DrinkDTO convertToDTO(Drink drink) {
        DrinkDTO dto = new DrinkDTO();
        dto.setName(drink.getName());
        dto.setSweetnessScore(drink.getSweetnessScore());
        dto.setInstructions(drink.getInstructions());

        // Hämtar endast kategorinamnet (List<Category> --> List<String>)
        dto.setCategories(drink.getCategories().stream()
                .map(Category::getName)
                .toList());

        // Hämtar ingredienserna och förenklar dem
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
}

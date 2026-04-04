package org.example.drinkapi.service;

import org.example.drinkapi.dto.DrinkDTO;
import org.example.drinkapi.mapper.DrinkMapper;
import org.example.drinkapi.model.Drink;
import org.example.drinkapi.repository.DrinkRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DrinkService {

    private final DrinkRepository drinkRepository;
    private final DrinkMapper drinkMapper;

    public DrinkService(DrinkRepository drinkRepository, DrinkMapper drinkMapper) {
        this.drinkRepository = drinkRepository;
        this.drinkMapper = drinkMapper;
    }

    public List<DrinkDTO> getDrinks(@RequestParam(required = false) String name) {
        List<Drink> drinks;
        if (name != null) {
            drinks = drinkRepository.findByNameContainingIgnoreCase(name);
        } else {
            drinks = drinkRepository.findAll();
        }
        return drinks.stream().map(drinkMapper::convertToDTO).toList();
    }

    public List<DrinkDTO> getByCategory(@PathVariable String category) {
        return drinkRepository.findByCategoriesNameIgnoreCase(category)
                .stream().map(drinkMapper::convertToDTO).toList();
    }

    public List<DrinkDTO> universalSearch(@RequestParam String query) {
        List<Drink> drinks = drinkRepository.findByNameContainingIgnoreCaseOrCategoriesNameIgnoreCase(query, query);

        return drinks.stream().map(drinkMapper::convertToDTO).collect(Collectors.toList());
    }

    public List<DrinkDTO> getByIngredient(@PathVariable String ingredient) {
        return drinkRepository.findByDrinkIngredientsIngredientNameIgnoreCase(ingredient)
                .stream().map(drinkMapper::convertToDTO).toList();
    }

    public List<DrinkDTO> getSpiritAndSweetness(
            @RequestParam String spirit,
            @RequestParam int sweetness) {

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
                .stream().map(drinkMapper::convertToDTO).toList();
    }

    public List<DrinkDTO> getByMultipleIngredients(@RequestParam List<String> names) {
        List<String> lowerCaseNames = names.stream()
                .map(String::toLowerCase)
                .toList();

        return drinkRepository.findByAllIngredients(lowerCaseNames,(long) names.size())
                .stream().map(drinkMapper::convertToDTO).toList();
    }

    public DrinkDTO getRandom() {
        return drinkRepository.findByRandomDrink()
                .map(drinkMapper::convertToDTO)
                .orElseThrow(() -> new RuntimeException("No drinks found"));
    }
}

package org.example.drinkapi.controller;

import org.example.drinkapi.dto.DrinkDTO;
import org.example.drinkapi.dto.DrinkIngredientDTO;
import org.example.drinkapi.model.Category;
import org.example.drinkapi.model.Drink;
import org.example.drinkapi.repository.DrinkRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/drinks")
public class DrinkController {

    private final DrinkRepository drinkRepository;

    public DrinkController(DrinkRepository drinkRepository) {
        this.drinkRepository = drinkRepository;
    }

    @GetMapping
    public List<DrinkDTO> getAllDrinks() {
        List<Drink> drinks = drinkRepository.findByNameContainingIgnoreCase("Gimlet");

        // Mappar om varje Drink-entitet till en DrinkDTO
        return drinks.stream()
                .map(this::convertToDTO)
                .toList();
    }

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

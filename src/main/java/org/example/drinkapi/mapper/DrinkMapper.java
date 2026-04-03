package org.example.drinkapi.mapper;

import org.example.drinkapi.dto.DrinkDTO;
import org.example.drinkapi.dto.DrinkIngredientDTO;
import org.example.drinkapi.model.Category;
import org.example.drinkapi.model.Drink;
import org.springframework.stereotype.Component;

@Component
public class DrinkMapper {

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
}

package org.example.drinkapi.dto;

import lombok.Data;

import java.util.List;


@Data
public class DrinkDTO {
    private String name;
    private Integer sweetnessScore;
    private List<String> categories;
    private String instructions;
    private List<DrinkIngredientDTO> ingredients;

}

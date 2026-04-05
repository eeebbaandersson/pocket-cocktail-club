package org.example.drinkapi.dto;


import lombok.Data;

@Data
public class DrinkIngredientDTO {
    private String name;
    private double quantity;
    private String unit;

}

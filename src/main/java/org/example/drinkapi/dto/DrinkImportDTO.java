package org.example.drinkapi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class DrinkImportDTO {

    private String name;

    @JsonProperty("sweetness_score")
    private int sweetnessScore;

    @JsonProperty("categories")
    private List<String> categoryNames;

    private List<IngredientImportDTO> ingredients;
    private String instructions;
}

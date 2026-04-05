package org.example.drinkapi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class IngredientImportDTO {

    private String name;
    private double quantity;
    private String unit;

    @JsonProperty("is_alcoholic")
    private boolean alcoholic;
}

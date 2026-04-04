package org.example.drinkapi.controller;

import org.example.drinkapi.dto.DrinkDTO;
import org.example.drinkapi.service.DrinkService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drinks")
public class DrinkController {

    private final DrinkService drinkService;

    public DrinkController(DrinkService drinkService) {
        this.drinkService = drinkService;
    }

    @GetMapping
    public List<DrinkDTO> getDrinks(@RequestParam(required = false) String name) {
       return drinkService.getDrinks(name);
    }

    @GetMapping("/category/{category}")
    public List<DrinkDTO> getByCategory(@PathVariable String category) {
        return drinkService.getByCategory(category);
    }

    @GetMapping("/search/all")
    public List<DrinkDTO> universalSearch(@RequestParam String query) {
       return  drinkService.universalSearch(query);
    }

    @GetMapping("/ingredient/{ingredient}")
    public List<DrinkDTO> getByIngredient(@PathVariable String ingredient) {
        return drinkService.getByIngredient(ingredient);
    }

    @GetMapping("/filter/combined")
    public List<DrinkDTO> getSpiritAndSweetness(
            @RequestParam String spirit,
            @RequestParam int sweetness) {
      return drinkService.getSpiritAndSweetness(spirit, sweetness);
    }

    @GetMapping("/search/ingredients")
    public List<DrinkDTO> getByMultipleIngredients(@RequestParam List<String> names) {
        return  drinkService.getByMultipleIngredients(names);
    }

    @GetMapping("/random")
    public DrinkDTO getRandom() {
        return drinkService.getRandom();
    }

}

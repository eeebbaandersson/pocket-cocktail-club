package org.example.drinkapi.controller;

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
    public List<Drink> findDrinks() {
        return drinkRepository.findAll();
    }
}

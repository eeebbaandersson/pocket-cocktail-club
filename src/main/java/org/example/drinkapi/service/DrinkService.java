package org.example.drinkapi.service;

import org.example.drinkapi.repository.DrinkRepository;
import org.springframework.stereotype.Service;

@Service
public class DrinkService {

    private DrinkRepository drinkRepository;

    public DrinkService(DrinkRepository drinkRepository) {
        this.drinkRepository = drinkRepository;
    }


}

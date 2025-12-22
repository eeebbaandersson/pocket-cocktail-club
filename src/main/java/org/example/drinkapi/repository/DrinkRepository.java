package org.example.drinkapi.repository;

import org.example.drinkapi.model.Drink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DrinkRepository extends JpaRepository<Drink, Integer> {

    List<Drink> findByNameContainingIgnoreCase(String name);

}

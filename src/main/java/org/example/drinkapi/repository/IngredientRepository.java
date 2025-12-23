package org.example.drinkapi.repository;

import org.example.drinkapi.model.Category;
import org.example.drinkapi.model.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Integer> {

    Optional<Ingredient> findByName(String name);
}

package org.example.drinkapi.repository;

import org.example.drinkapi.model.Drink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DrinkRepository extends JpaRepository<Drink, Integer> {


    List<Drink> findByNameContainingIgnoreCase(String name);

    List<Drink> findByCategoriesNameIgnoreCase(String categoryName);

    List<Drink> findByNameContainingIgnoreCaseOrCategoriesNameIgnoreCase(String name, String categoryName);

    List<Drink> findByDrinkIngredientsIngredientNameIgnoreCase(String ingredientName);

    List<Drink> findBySweetnessScoreAndDrinkIngredientsIngredientNameInIgnoreCase(int sweetness, List<String> ingredientNames);

    @Query(value = "SELECT * FROM Drinks ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Optional<Drink> findByRandomDrink();


    @Query("SELECT d FROM Drink d " +
    "JOIN d.drinkIngredients di " +
    "WHERE lOWER(di.ingredient.name) IN :names " +
    "GROUP BY d.id " +
    "HAVING COUNT(DISTINCT (LOWER(di.ingredient.name))) = :count")
    List<Drink> findByAllIngredients(@Param("names") List<String> names, @Param("count") long count);

}

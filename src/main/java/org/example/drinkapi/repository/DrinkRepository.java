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

    // Sök på namn
    List<Drink> findByNameContainingIgnoreCase(String name);

    // Sök på kategori
    List<Drink> findByCategoriesNameIgnoreCase(String categoryName);

    // Universal sökning: Hittar drinkar drinkar där nament innehåller sökordet eller där en kategori heter exakt som sökordet
    List<Drink> findByNameContainingIgnoreCaseOrCategoriesNameIgnoreCase(String name, String categoryName);

    // Sök på ingrediens (DrinkIngredients -> Ingredients -> Name)
    List<Drink> findByDrinkIngredientsIngredientNameIgnoreCase(String ingredientName);

    // Sök på kombination: Sprit + Sötma (ingrediens + sötma-värde)
    List<Drink> findBySweetnessScoreAndDrinkIngredientsIngredientNameIgnoreCase(int sweetness, String ingredientName);

    // Hitta slumpmässig drink (Här behövs "Native Query" för SQL har inbyggd RAND-funktion)
    @Query(value = "SELECT * FROM Drinks ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Optional<Drink> findByRandomDrink();


    @Query("SELECT d FROM Drink d " +
    "JOIN d.drinkIngredients di " +
    "WHERE lOWER(di.ingredient.name) IN :names " +
    "GROUP BY d.id " +
    "HAVING COUNT(DISTINCT (LOWER(di.ingredient.name))) = :count")
    List<Drink> findByAllIngredients(@Param("names") List<String> names, @Param("count") long count);

}

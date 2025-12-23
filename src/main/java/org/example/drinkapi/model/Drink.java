package org.example.drinkapi.model;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Drinks")
@NoArgsConstructor
public class Drink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="drink_id")
    private Integer id;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @Column(name = "sweetness_score")
    private Integer sweetnessScore;

    @OneToMany(mappedBy = "drink", cascade =  CascadeType.ALL, orphanRemoval = true)
    private List<DrinkIngredient> drinkIngredients = new ArrayList<>();


    @ManyToMany
    @JoinTable(
            name = "DrinkCategories",
            joinColumns = @JoinColumn(name = "drink_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private List<Category> categories = new ArrayList<>();

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public Integer getSweetnessScore() {
        return sweetnessScore;
    }

    public void setSweetnessScore(Integer sweetnessScore) {
        this.sweetnessScore = sweetnessScore;
    }

    public List<DrinkIngredient> getDrinkIngredients() {
        return drinkIngredients;
    }

    public void setDrinkIngredients(List<DrinkIngredient> drinkIngredients) {
        this.drinkIngredients = drinkIngredients;
    }

    public List<Category> getCategories() {
        return categories;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }
}

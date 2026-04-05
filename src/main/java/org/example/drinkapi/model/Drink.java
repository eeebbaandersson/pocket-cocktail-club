package org.example.drinkapi.model;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@Entity
@NoArgsConstructor
@Table(name = "Drinks")
@JsonPropertyOrder({ "id", "name", "categories", "sweetnessScore", "drinkIngredients", "instructions" })
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

}

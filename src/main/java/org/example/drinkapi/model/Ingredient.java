package org.example.drinkapi.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "Ingredients")
@NoArgsConstructor
public class Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="ingredient_id")
    private Integer id;

    @Column(unique = true)
    private String name;

    @Column(name = "is_alcoholic")
    private boolean isAlcoholic;

}

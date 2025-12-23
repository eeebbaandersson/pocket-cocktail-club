package org.example.drinkapi.model;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;

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

    public boolean isAlcoholic() {
        return isAlcoholic;
    }

    public void setAlcoholic(boolean alcoholic) {
        isAlcoholic = alcoholic;
    }
}

package org.example.drinkapi.model;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Drinks")
@NoArgsConstructor
public class Drink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="drink_id")
    private Integer id;

    private String name;
    private String instructions;

    @Column(name = "sweetness_score")
    private Integer sweetnessScore;


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
}

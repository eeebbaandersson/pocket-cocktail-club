-- 1. Rensa gamla tabeller
DROP TABLE IF EXISTS DrinkCategories;
DROP TABLE IF EXISTS DrinkIngredients;
DROP TABLE IF EXISTS Categories;
DROP TABLE IF EXISTS Ingredients;
DROP TABLE IF EXISTS Drinks;

-- 2. Huvudtabell för Drinkar
CREATE TABLE Drinks (
                        drink_id INT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(255) NOT NULL,
                        instructions TEXT,
                        sweetness_score INT
);

-- 3. Unika Ingredienser (Här lagras bara namnet och om den är alkoholhaltig)
CREATE TABLE Ingredients (
                             ingredient_id INT AUTO_INCREMENT PRIMARY KEY,
                             name VARCHAR(255) NOT NULL UNIQUE,
                             is_alcoholic BOOLEAN DEFAULT FALSE
);

-- 4. Kategorier
CREATE TABLE Categories (
                            category_id INT AUTO_INCREMENT PRIMARY KEY,
                            name VARCHAR(255) NOT NULL UNIQUE
);

-- 5. Kopplingstabell för Ingredienser (Här sparar vi mängd och enhet!)
CREATE TABLE DrinkIngredients (
                                  drink_id INT,
                                  ingredient_id INT,
                                  quantity DOUBLE,
                                  unit VARCHAR(50),
                                  PRIMARY KEY (drink_id, ingredient_id),
                                  FOREIGN KEY (drink_id) REFERENCES Drinks(drink_id) ON DELETE CASCADE,
                                  FOREIGN KEY (ingredient_id) REFERENCES Ingredients(ingredient_id) ON DELETE CASCADE
);

-- 6. Kopplingstabell för Kategorier
CREATE TABLE DrinkCategories (
                                 drink_id INT,
                                 category_id INT,
                                 PRIMARY KEY (drink_id, category_id),
                                 FOREIGN KEY (drink_id) REFERENCES Drinks(drink_id) ON DELETE CASCADE,
                                 FOREIGN KEY (category_id) REFERENCES Categories(category_id) ON DELETE CASCADE
);
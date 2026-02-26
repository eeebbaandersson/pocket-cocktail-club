# [Pocket Cocktail Club] 🍸

<p align="center">
<img src="screenshots/app-preview.png" alt="Pocket Cocktail Club Preview" width="1000">
<img src="screenshots/app-preview2.png" alt="Pocket Cocktail Club Preview" width="1000">
<img src="screenshots/app-preview3.png" alt="Pocket Cocktail Club Preview" width="1000">
</p>

Pocket Cocktail Club is a full-stack web application built with **Java Spring Boot**, **MySQL** and **JavaScript**.
It allows the user to easily find and discover new drink recipes based on different search terms or specific preferences.

⚠️ **Note:** This project is currently a Work in Progress as I continue to refine features and the design.

---

## ✨ Functions
The application features multiple ways to find the perfect recipe:

* **Smart Search:** Find recipes by Name, Category (e.g. "Classic", "Sour") or list preferred ingredients (separated by `,` ).
* **Interactive Taste Filter:** Use the spirit quick-select buttons in combination with the dynamic **Sweetness Slider** to find drinks that match both preferred base spirit and desired flavor profile (ranging from bitter to sweet).
* **Randomizer:** Not sure what you are looking for? Enter the word "Random" and a surprise recipe will be presented.

## 🛠️ Tech Stack
* **Backend:** Java 25, Spring Boot (Spring Web, Spring Data JPA)
* **Database:** MySQL
* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)

## 📋 Requirements
* **JDK 25** or higher
* **MySQL Server**
* **Maven** (for dependency management)
* **Modern Web Browser** (Chrome, Firefox, Safari or Edge)

---

## 🚀 Installation & setup
To get the project running on your local machine, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/eeebbaandersson/pocket-cocktail-club.git
cd pocket-cocktail-club
```

### 2. Database Configuration
1. **Create Database:** Create a MySQL database named cocktail_db.
2. **Properties File:** In src/main/resources/, create a file named application.properties.
3. **Configure Credentials:** Copy the template from application.properties.example and update the values. You have two options:

**Option A (Directly in file):** Replace the placeholders with your local details:
 * spring.datasource.url=jdbc:mysql://localhost:3306/cocktail_db
 * spring.datasource.username=your_username
 * spring.datasource.password=your_password

**Option B (Environment Variables):** Keep the file as is and set the variables DB_URL, DB_USER, and DB_PASSWORD in your system or IDE.


### 3. Data Initialization
The application is designed to be plug-and-play:
* **Schema:** Hibernate is set to ddl-auto=update, which automatically generates the database tables.
* **Data:** Initial cocktail data is imported from src/main/resources/drink_data.json automatically on startup.
* **Note:** Manual execution of schema.sql is not required.

### 4. Run the Application
* Launch the project via IntelliJ IDEA (run the DrinkApiApplication class) or use the terminal: ./mvnw spring-boot:run.
* Once the application has started, open your browser and navigate to: http://localhost:8080.

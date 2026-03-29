# 🍸 Pocket Cocktail Club 
**Your compass in the cocktail jungle – A curated guide for the home bartender or a night out.**

<p align="center">
<img src="screenshots/app-preview.png" alt="Pocket Cocktail Club Preview" width="1000">
</p>

**Pocket Cocktail Club** is a full-stack web application built with **Java Spring Boot**, **MySQL** and **JavaScript**.

Unsure what a "New York Sour" actually contains while standing at the bar? 
Look it up instantly before you order. Whether you're exploring the city's nightlife or mixing drinks in your own kitchen, this app allows you to easily discover recipes based on your specific preferences, available ingredients, or desired flavor profile.

⚠️ **Note –** This project is currently a Work in Progress as I continue to refine features and the UI.

---

## ✨ Key Features & User Guide
* 🔍 **Smart Navigation (Search)** – Quickly look up unfamiliar drinks at the bar by Name or Category (e.g., "Classic", "Sour").
* 🍹 **The Home Mixologist (Ingredient Filter)** – Don't know what to make? List the ingredients you have (separated by `,`) to find matching recipes in seconds.
* 🧭 **Flavor Compass (Taste Filter)** – Use the **Sweetness Slider** to discover new favorites based on your preferred flavor profile, ranging from bitter to sweet.
* 🎲 **Roulette Mode** - Feeling adventurous? Simply enter "Random" to let the app pick a surprise curated recipe for you.

---

## 🛠️ Tech Stack
* **Backend –** Java 25 & Spring Boot (Spring Web, Spring Data JPA)
* **Database –** MySQL
* **Frontend –** HTML5, Modern CSS, Vanilla JavaScript
* **DevOps –** Docker, Docker Compose, GitHub Actions (CI/CD)

## 📋 Requirements
* **Docker & Docker Desktop –** Recommended (runs everything with one command)
* **Alternative (Manual Setup) –** JDK 25, MySQL Server, and Maven.

---

## 🚀 Installation & setup
Get the club running in two simple steps:

### 1. Clone and Enter
```bash
git clone https://github.com/eeebbaandersson/pocket-cocktail-club.git
cd pocket-cocktail-club # <-- Make sure you are inside the project folder
```

### 2. Launch with Docker ⚡️
```bash
docker-compose up --build
```
* **Application –** http://localhost:8080
* **Note –** Database setup and drink data import (from `drink_data.json`) are handled automatically.


---

## 📦 Alternative Setup & CI/CD
<details>
<summary><b>Pull Pre-built Image (GHCR)</b></summary>
Every GitHub Release automatically pushes a fresh image to our registry:

```bash
docker pull ghcr.io/eeebbaandersson/drink-api:latest
```
</details>


<details>
<summary><b>Manual IDE Execution</b></summary>

Start Database: Run only the MySQL container: docker-compose up db

Configuration: Check application.properties (Defaults: root/root)

Run Application: Launch DrinkApiApplication in your IDE or via terminal:

```bash
./mvnw spring-boot:run
```
</details>


## 🛠️ Data & Automation

* **Plug-and-play –** Hibernate `ddl-auto=update` manages your database tables automatically.
* **Auto-Init –** Initial cocktail data is imported from `src/main/resources/drink_data.json` on the first startup.
* **No Manual SQL –** Execution of `schema.sql` is not required.

package org.example.drinkapi.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.example.drinkapi.dto.DrinkImportDTO;
import org.example.drinkapi.mapper.DrinkMapper;
import org.example.drinkapi.model.Drink;
import org.example.drinkapi.repository.DrinkRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.InputStream;
import java.util.List;

@Configuration
@Slf4j
public class DatabaseInitializer {

    private final DrinkMapper drinkMapper;
    private final DrinkRepository drinkRepository;

    public DatabaseInitializer(DrinkMapper drinkMapper, DrinkRepository drinkRepository) {
        this.drinkMapper = drinkMapper;
        this.drinkRepository = drinkRepository;
    }

    @Bean
    CommandLineRunner initDatabase() {
        return args -> {
            if (drinkRepository.count() > 0) {
                log.info("Database already initialized, skipping import.");
                return;
            }
            log.info("Database is empty. Starting import from JSON-file...");

            try (InputStream inputStream = getClass().getResourceAsStream("/drink_data.json")) {
            ObjectMapper mapper = new ObjectMapper().configure(JsonParser.Feature.ALLOW_COMMENTS, true);
            List<DrinkImportDTO> dtos = mapper.readValue(inputStream, new TypeReference<>() {});

            for (DrinkImportDTO dto : dtos) {
                Drink drink = drinkMapper.convertToEntity(dto);
                drinkRepository.save(drink);
            }

            log.info("Import finished. Successfully imported {} drinks.", dtos.size());
            } catch (Exception e) {
                log.error("Error during database initialization: {}", e.getMessage(), e);
            }
        };
    }
}

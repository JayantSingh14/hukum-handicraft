package com.zosh.controller;

import com.zosh.model.Occasion;
import com.zosh.service.OccasionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/occasions")
@RequiredArgsConstructor
public class OccasionController {

    private final OccasionService occasionService;

    @GetMapping
    public ResponseEntity<List<Occasion>> getAll() {
        return ResponseEntity.ok(occasionService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Occasion> getById(@PathVariable Long id) {
        return ResponseEntity.ok(occasionService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Occasion> create(@RequestParam String name) {
        return new ResponseEntity<>(occasionService.createOccasion(name), HttpStatus.CREATED);
    }
}

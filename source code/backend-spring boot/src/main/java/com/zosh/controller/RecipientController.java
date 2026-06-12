package com.zosh.controller;

import com.zosh.model.Recipient;
import com.zosh.service.RecipientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recipients")
@RequiredArgsConstructor
public class RecipientController {

    private final RecipientService recipientService;

    @GetMapping
    public ResponseEntity<List<Recipient>> getAll() {
        return ResponseEntity.ok(recipientService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recipient> getById(@PathVariable Long id) {
        return ResponseEntity.ok(recipientService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Recipient> create(@RequestParam String name) {
        return new ResponseEntity<>(recipientService.createRecipient(name), HttpStatus.CREATED);
    }
}

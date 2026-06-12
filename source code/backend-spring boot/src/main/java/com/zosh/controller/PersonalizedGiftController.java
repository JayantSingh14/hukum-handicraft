package com.zosh.controller;

import com.zosh.exception.ProductException;
import com.zosh.exception.UserException;
import com.zosh.model.PersonalizedGift;
import com.zosh.model.User;
import com.zosh.request.CreatePersonalizedGiftRequest;
import com.zosh.service.PersonalizedGiftService;
import com.zosh.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/personalized-gifts")
@RequiredArgsConstructor
public class PersonalizedGiftController {

    private final PersonalizedGiftService personalizedGiftService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<PersonalizedGift> create(
            @RequestBody CreatePersonalizedGiftRequest request,
            @RequestHeader("Authorization") String jwt) throws ProductException, UserException {
        User user = userService.findUserProfileByJwt(jwt);
        PersonalizedGift gift = personalizedGiftService.createPersonalizedGift(
                request.getProductId(),
                user.getId(),
                request.getUploadedImage(),
                request.getCustomMessage());
        return new ResponseEntity<>(gift, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<PersonalizedGift>> getMyGifts(
            @RequestHeader("Authorization") String jwt) throws UserException {
        User user = userService.findUserProfileByJwt(jwt);
        return ResponseEntity.ok(personalizedGiftService.findByUserId(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PersonalizedGift> getById(@PathVariable Long id) {
        return ResponseEntity.ok(personalizedGiftService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        personalizedGiftService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

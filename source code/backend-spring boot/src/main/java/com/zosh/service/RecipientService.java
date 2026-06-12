package com.zosh.service;

import com.zosh.model.Recipient;

import java.util.List;

public interface RecipientService {
    Recipient createRecipient(String name);
    Recipient findById(Long id);
    List<Recipient> findAll();
    Recipient update(Long id, String name);
    void delete(Long id);
}

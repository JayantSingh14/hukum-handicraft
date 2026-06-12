package com.zosh.service.impl;

import com.zosh.model.Recipient;
import com.zosh.repository.RecipientRepository;
import com.zosh.service.RecipientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecipientServiceImpl implements RecipientService {

    private final RecipientRepository recipientRepository;

    @Override
    public Recipient createRecipient(String name) {
        return recipientRepository.findByName(name)
                .orElseGet(() -> recipientRepository.save(new Recipient(null, name)));
    }

    @Override
    public Recipient findById(Long id) {
        return recipientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Recipient not found"));
    }

    @Override
    public List<Recipient> findAll() {
        return recipientRepository.findAll();
    }

    @Override
    public Recipient update(Long id, String name) {
        Recipient recipient = findById(id);
        recipient.setName(name);
        return recipientRepository.save(recipient);
    }

    @Override
    public void delete(Long id) {
        recipientRepository.delete(findById(id));
    }
}

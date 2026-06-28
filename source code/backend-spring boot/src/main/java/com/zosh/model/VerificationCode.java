package com.zosh.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class VerificationCode {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "verification_code_seq")
    @SequenceGenerator(name = "verification_code_seq", sequenceName = "verification_code_seq", allocationSize = 1)
    private Long id;

    private String otp;

    private String email;

    @OneToOne
    private User user;
}

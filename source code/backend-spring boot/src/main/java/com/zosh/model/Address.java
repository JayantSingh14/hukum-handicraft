package com.zosh.model;

import com.zosh.domain.AddressType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "address_seq")
    @SequenceGenerator(name = "address_seq", sequenceName = "address_seq", allocationSize = 1)
    private Long id;

    private String name;

    private String locality;

    private String address;

    private String city;

    private String state;

    private String pinCode;

    private String mobile;

    @Enumerated(EnumType.STRING)
    private AddressType addressType = AddressType.HOME;

    private boolean isDefault;
}

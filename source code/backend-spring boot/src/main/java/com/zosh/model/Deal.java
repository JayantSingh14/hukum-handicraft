package com.zosh.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Deal {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "deal_seq")
    @SequenceGenerator(name = "deal_seq", sequenceName = "deal_seq", allocationSize = 1)
    private Long id;
    private Integer discount;

    @OneToOne
    private HomeCategory category;


}

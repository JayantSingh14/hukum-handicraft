package com.zosh.model;

import com.zosh.domain.HomeCategorySection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HomeCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "home_category_seq")
    @SequenceGenerator(name = "home_category_seq", sequenceName = "home_category_seq", allocationSize = 1)
    private Long id;

    private String name;
    private String image;
    private String categoryId;
    private HomeCategorySection section;
}

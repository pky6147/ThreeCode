package com.tc_back.productInput.entity;

import com.tc_back.product.Product;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_input")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductInput {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productInputId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(length = 50, nullable = false)
    private String lotNo;

    @Column(nullable = false)
    private Integer productInputQty;

    @Column(nullable = false)
    private LocalDate productInputDate;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Column(length = 1, nullable = false)
    private String isDelete;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        isDelete = "N";
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

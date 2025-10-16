package com.tc_back.product;

import com.tc_back.Company.Company;
import com.tc_back.img.ProductImg;
import com.tc_back.routingStep.entity.RoutingStep;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "product")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(length = 10, nullable = false)
    private String paintType;

    @Column(length = 100, nullable = false)
    private String productName;

    @Column(length = 50, nullable = false)
    private String productNo;

    @Column(length = 20, nullable = false)
    private String category;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Column(length = 20)
    private String color;

    @Column(length = 1, nullable = false)
    private String isActive;

    @Column(length = 1, nullable = false)
    private String isDelete;

    @Column(length = 200)
    private String remark;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProductImg> images = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<RoutingStep> routingSteps = new ArrayList<>();
}

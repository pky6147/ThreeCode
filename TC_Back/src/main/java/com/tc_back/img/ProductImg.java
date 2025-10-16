package com.tc_back.img;

import com.tc_back.product.Product;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_img")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductImg {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productImgId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(length = 200, nullable = false)
    private String imgPath;

    @Column(length = 1, nullable = false)
    private String top;
}


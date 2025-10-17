package com.tc_back.product.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductListDto {
    private Long productId;
    private String companyName;
    private String productNo;
    private String productName;
    private String category;
    private String paintType;
    private BigDecimal price;
    private String remark;
    private String isActive;
}

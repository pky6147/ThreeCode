package com.tc_back.MaterialStock.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaterialStockDto {

    private Long materialId;
    private String materialName;
    private String materialNo;
    private String spec;
    private String maker;

    private Long companyId;
    private String companyName;

    private Long count; // 재고 수량
}
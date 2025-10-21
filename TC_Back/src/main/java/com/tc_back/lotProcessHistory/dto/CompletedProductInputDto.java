package com.tc_back.lotProcessHistory.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompletedProductInputDto {
    private Long productInputId;
    private String lotNo;
    private String productName;
    private String companyName;
    private String productNo;
    private String category;
    private String paintType;
    private int remainingQty;
    private Integer productInputQty;
    private String productInputDate;
}

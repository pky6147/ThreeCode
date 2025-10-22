package com.tc_back.productInput.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductInputResponseDto {
    private Long productInputId;    // 입고 이력 아이디
    private Long productId;
    private String lotNo;
    private String companyName;
    private String productNo;
    private String productName;
    private String category;
    private String paintType;
    private int productInputQty;
    private LocalDate productInputDate;
}

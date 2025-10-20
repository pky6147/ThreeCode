package com.tc_back.productInput.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductInputRequestDto {
    private Long productId;
    private int productInputQty;
    private LocalDate productInputDate;
}

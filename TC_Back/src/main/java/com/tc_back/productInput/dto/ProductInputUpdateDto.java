package com.tc_back.productInput.dto;

import lombok.*;

import java.time.LocalDate;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductInputUpdateDto {


    private Integer productInputQty;   // 수정 수량
    private LocalDate productInputDate; // 수정 입고일자
}

package com.tc_back.ProductOutput.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductOutputRequestDto {
    private Long productInputId;
    private Integer productOutputQty;
    private LocalDate productOutputDate;
    private String remark;
}

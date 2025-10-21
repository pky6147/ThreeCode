package com.tc_back.ProductOutput.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductOutputResponseDto {
    private Long productOutputId;
    private Long productInputId;
    private String productOutputNo;
    private Integer productOutputQty;
    private LocalDate productOutputDate;
    private String remark;

    private String companyName;
    private String productNo;
    private String productName;
    private String category;
    private String paintType;
}

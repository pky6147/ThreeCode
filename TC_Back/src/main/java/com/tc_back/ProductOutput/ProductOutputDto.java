package com.tc_back.ProductOutput;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductOutputDto {
    private Long productInputId;
    private String productOutputNo;
    private Integer productOutputQty;
    private LocalDate productOutputDate;
    private String remark;
}
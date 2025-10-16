package com.tc_back.ProductOutput;

import com.fasterxml.jackson.annotation.JsonFormat;
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

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate productOutputDate;
    private String remark;
}
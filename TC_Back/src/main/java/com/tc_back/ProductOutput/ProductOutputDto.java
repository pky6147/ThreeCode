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
    private Long productOutputId;
    private String productOutputNo;
    private Integer productOutputQty;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate productOutputDate;
    private String remark;

    // 2. [추가] 출고 현황 조회를 위한 필드 (JOIN 데이터)
    private String companyName;     // 거래처명
    private String productNo;       // 품목번호
    private String productName;     // 품목명
    private String category;        // 분류
    private String paintType;       // 도장방식
}
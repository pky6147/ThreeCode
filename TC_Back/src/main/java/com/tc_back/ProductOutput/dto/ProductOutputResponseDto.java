package com.tc_back.ProductOutput.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductOutputResponseDto {

    // 출고 테이블
    private Long productOutputId;     // 출고 이력 ID
    private String productOutputNo;   // 출고번호
    private Integer productOutputQty; // 출고 수량
    private LocalDate productOutputDate; // 출고일자
    private String remark;            // 비고

    // 입고 정보
    private Long productInputId;      // 참조 입고 ID
    private String lotNo;             // 입고 LOT 번호
    private Integer productInputQty;  // 입고 수량
    private LocalDate productInputDate; // 입고일자

    // 제품/거래처 정보
    private String companyName;       // 거래처명
    private String productNo;         // 품목번호
    private String productName;       // 품목명
    private String category;          // 분류
    private String paintType;         // 도장방식
}
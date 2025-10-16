package com.tc_back.product.dto;

import com.tc_back.routingStep.dto.RoutingStepInfo;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponseDto {
    private Long productId;
    private String companyName;
    private String paintType;
    private String productName;
    private String productNo;
    private String category;
    private BigDecimal price;
    private String color;
    private String remark;
    private String isActive; // Y/N
    private List<String> imagePaths; // 대표 이미지 등 필요
    private List<RoutingStepInfo> routingSteps; // 순서대로 보여줄 정보
}

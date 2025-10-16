package com.tc_back.product.dto;

import com.tc_back.routingStep.dto.RoutingStepDto;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDto {
    private Long productId;
    private Long companyId;
    private String paintType;
    private String productName;
    private String productNo;
    private String category;
    private BigDecimal price;
    private String color;
    private String isActive;
    private String remark;

    private List<MultipartFile> images;
    private List<RoutingStepDto> routingSteps;
}


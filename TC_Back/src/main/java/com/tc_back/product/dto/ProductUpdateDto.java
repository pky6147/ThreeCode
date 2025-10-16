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
public class ProductUpdateDto {
    private String paintType;
    private String productName;
    private String productNo;
    private String category;
    private BigDecimal price;
    private String color;
    private String remark;
    private String isActive; // Y/N

    // 이미지 수정
    private List<MultipartFile> images;

    // 라우팅스텝 수정
    private List<RoutingStepDto> routingSteps;

}

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
public class ProductUpdateForm {

    // 기본 정보
    private String paintType;        // 액체/분체
    private String productName;      // 품목명
    private String productNo;        // 품목번호
    private String category;         // 분류
    private BigDecimal price;        // 품목 단가
    private String color;            // 색상
    private String remark;           // 비고
    private String isActive;         // Y/N 사용 여부

    // 이미지 (최대 3개)
    private List<MultipartFile> images;

    // 라우팅스텝 JSON 문자열
    // 예: [{"routingMasterId":2},{"routingMasterId":1},{"routingMasterId":3}]
    private String routingStepsJson;
    private List<Long> productImgIds;  // 기존 이미지 ID
    private List<String> topFlags;      // Y/N
    // List<RoutingStepDto>로 변환하여 ProductUpdateDto 생성
    public ProductUpdateDto toUpdateDto(List<RoutingStepDto> routingSteps) {
        ProductUpdateDto dto = new ProductUpdateDto();
        dto.setPaintType(this.paintType);
        dto.setProductName(this.productName);
        dto.setProductNo(this.productNo);
        dto.setCategory(this.category);
        dto.setPrice(this.price);
        dto.setColor(this.color);
        dto.setRemark(this.remark);
        dto.setIsActive(this.isActive);
        dto.setRoutingSteps(routingSteps);
        return dto;
    }

}

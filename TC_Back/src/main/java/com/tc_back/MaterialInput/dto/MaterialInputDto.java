package com.tc_back.MaterialInput.dto;


import com.tc_back.Company.Company;
import com.tc_back.Material.entity.Material;
import com.tc_back.MaterialInput.entity.MaterialInput;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaterialInputDto {

    private Long materialInputId;       // PK
    private String materialInputNo;     // 입고번호

    @NotNull(message = "입고일자는 필수 입력입니다.")
    private LocalDate materialInputDate;

    private LocalDate makeDate;

    @NotNull(message = "입고수량은 필수 입력입니다.")
    private Integer materialInputQty;

    private BigDecimal total;           // 자동 계산 (입고수량 * specValue)

    private String isDelete;            // 삭제여부

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    // Material 정보
    private Long materialId;
    private Long companyId;
    private String companyName;
    private String materialName;
    private String materialNo;
    private String spec;
    private String specValue;
    private String maker;


    public MaterialInput toEntity(Material material) {
        return MaterialInput.builder()
                .materialInputId(this.materialInputId)
                .materialInputNo(this.materialInputNo)
                .material(material)
                .materialInputDate(this.materialInputDate)
                .makeDate(this.makeDate)
                .materialInputQty(this.materialInputQty)
                .total(this.total)
                .isDelete(this.isDelete != null ? this.isDelete : "N")
                .build();
    }

    public static MaterialInputDto fromEntity(MaterialInput entity) {
        Material material = entity.getMaterial();
        Company company = material.getCompany();

        return MaterialInputDto.builder()
                .materialInputId(entity.getMaterialInputId())
                .materialInputNo(entity.getMaterialInputNo())
                .materialInputDate(entity.getMaterialInputDate())
                .makeDate(entity.getMakeDate())
                .materialInputQty(entity.getMaterialInputQty())
                .total(entity.getTotal())
                .isDelete(entity.getIsDelete())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .materialId(material.getMaterialId())
                .companyId(company.getCompanyId())
                .companyName(company.getCompanyName())
                .materialName(material.getMaterialName())
                .materialNo(material.getMaterialNo())
                .spec(material.getSpec())
                .specValue(material.getSpecValue())
                .maker(material.getMaker())
                .build();
    }
}

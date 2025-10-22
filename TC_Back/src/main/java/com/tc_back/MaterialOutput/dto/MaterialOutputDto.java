package com.tc_back.MaterialOutput.dto;

import com.tc_back.Company.Company;
import com.tc_back.Material.entity.Material;
import com.tc_back.MaterialInput.entity.MaterialInput;
import com.tc_back.MaterialOutput.entity.MaterialOutput;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaterialOutputDto {

    private Long materialOutputId;        // PK
    private String materialOutputNo;      // 출고번호

    @NotNull(message = "출고일자는 필수 입력입니다.")
    private LocalDate materialOutputDate; // 출고일자

    @NotNull(message = "출고수량은 필수 입력입니다.")
    private Integer materialOutputQty;    // 출고수량

    private String isDelete;              // 삭제여부

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Integer remainQty; // 재고량

    // Material 정보
    private Long materialId;
    private String materialName;
    private String materialNo;
    private String spec;
    private String maker;

    // Company 정보
    private Long companyId;
    private String companyName;

    // MaterialInput 참조
    private Long materialInputId;
    private String materialInputNo;
    private LocalDate materialInputDate;

    /** ✅ DTO → Entity 변환 */
    public MaterialOutput toEntity(Material material, MaterialInput materialInput) {
        return MaterialOutput.builder()
                .materialOutputId(this.materialOutputId)
                .materialOutputNo(this.materialOutputNo)
                .material(material)
                .materialInput(materialInput)
                .materialOutputDate(this.materialOutputDate)
                .materialOutputQty(this.materialOutputQty)
                .isDelete(this.isDelete != null ? this.isDelete : "N")
                .build();
    }

    /** ✅ Entity → DTO 변환 */
    public static MaterialOutputDto fromEntity(MaterialOutput entity) {
        MaterialInput materialInput = entity.getMaterialInput();
        Material material = entity.getMaterial();
        Company company = material.getCompany();

        return MaterialOutputDto.builder()
                .materialOutputId(entity.getMaterialOutputId())
                .materialOutputNo(entity.getMaterialOutputNo())
                .materialOutputDate(entity.getMaterialOutputDate())
                .materialOutputQty(entity.getMaterialOutputQty())
                .isDelete(entity.getIsDelete())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .materialId(material.getMaterialId())
                .materialName(material.getMaterialName())
                .materialNo(material.getMaterialNo())
                .spec(material.getSpec())
                .maker(material.getMaker())
                .companyId(company.getCompanyId())
                .companyName(company.getCompanyName())
                // MaterialInput 참조 (출고 시 입고번호 표시용)
                .materialInputId(
                        materialInput != null
                                ? materialInput.getMaterialInputId()
                                : null
                )
                .materialInputNo(
                        materialInput != null
                                ? materialInput.getMaterialInputNo()
                                : null
                )
                .materialInputDate(
                        materialInput != null
                                ? materialInput.getMaterialInputDate()
                                : null
                )
                .remainQty(null)
                .build();
    }
}

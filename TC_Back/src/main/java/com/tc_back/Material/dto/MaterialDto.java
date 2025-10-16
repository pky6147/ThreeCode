package com.tc_back.Material.dto;


import com.tc_back.Company.Company;
import com.tc_back.Material.entity.Material;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaterialDto {

    private Long materialId;

    private Long companyId;  // company 엔티티 연결용 (필요 시)
    private String companyName;

    @NotBlank(message = "품목명은 필수 입력입니다.")
    private String materialName;

    @NotBlank(message = "품목번호는 필수 입력입니다.")
    private String materialNo;

    @NotBlank(message = "분류(category)는 필수 입력입니다.")
    private String category;

    private String color;
    private String spec;
    private String specValue;
    private String maker;
    private String isActive;
    private String remark;
    private String isDelete;


    public Material toEntity(Company company) {
        return Material.builder()
                .materialId(this.materialId)
                .company(company)
                .materialName(this.materialName)
                .materialNo(this.materialNo)
                .category(this.category)
                .color(this.color)
                .spec(this.spec)
                .specValue(this.specValue)
                .maker(this.maker)
                .isActive(this.isActive != null ? this.isActive : "Y")
                .remark(this.remark)
                .isDelete(this.isDelete != null ? this.isDelete : "N")
                .build();
    }

    public static MaterialDto fromEntity(Material entity) {
        return MaterialDto.builder()
                .materialId(entity.getMaterialId())
                .companyId(entity.getCompany().getCompanyId())
                .companyName(entity.getCompany().getCompanyName())
                .materialName(entity.getMaterialName())
                .materialNo(entity.getMaterialNo())
                .category(entity.getCategory())
                .color(entity.getColor())
                .spec(entity.getSpec())
                .specValue(entity.getSpecValue())
                .maker(entity.getMaker())
                .isActive(entity.getIsActive())
                .remark(entity.getRemark())
                .isDelete(entity.getIsDelete())
                .build();
    }
}

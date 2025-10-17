package com.tc_back.routingMaster.dto;


import com.tc_back.routingMaster.entity.RoutingMaster;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoutingMasterDto {

    private Long routingMasterId;

    @NotBlank(message = "공정코드는 필수 입력입니다.")
    private String processCode;

    @NotBlank(message = "공정명은 필수 입력입니다.")
    private String processName;

    @NotNull(message = "공정시간은 필수 입력입니다.")
    @Positive(message = "공정시간은 0보다 커야 합니다.")
    private Integer processTime;

    @NotNull(message = "공정순서는 필수 입력입니다.")
    @Positive(message = "공정순서는 0보다 커야 합니다.")
    private Integer processOrder;

    private String remark;


    public RoutingMaster toEntity() {
        return RoutingMaster.builder()
                .routingMasterId(this.routingMasterId)
                .processCode(this.processCode)
                .processName(this.processName)
                .processTime(this.processTime)
                .processOrder(this.processOrder)
                .remark(this.remark)
                .isDelete("N")
                .build();
    }

    public static RoutingMasterDto fromEntity(RoutingMaster entity) {
        return RoutingMasterDto.builder()
                .routingMasterId(entity.getRoutingMasterId())
                .processCode(entity.getProcessCode())
                .processName(entity.getProcessName())
                .processTime(entity.getProcessTime())
                .processOrder(entity.getProcessOrder())
                .remark(entity.getRemark())
                .build();
    }
}

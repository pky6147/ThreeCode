package com.tc_back.routingMaster.dto;


import com.tc_back.routingMaster.entity.RoutingMaster;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoutingMasterDto {

    private Long routingMasterId;

    @NotBlank(message = "processCode는 필수 입력입니다.")
    private String processCode;

    @NotBlank(message = "processName은 필수 입력입니다.")
    private String processName;

    @NotNull(message = "processTime은 필수 입력입니다.")
    private Integer processTime;

    @NotNull(message = "processOrder는 필수 입력입니다.")
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

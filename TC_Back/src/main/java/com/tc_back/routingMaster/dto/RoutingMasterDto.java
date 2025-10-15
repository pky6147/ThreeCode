package com.tc_back.routingMaster.dto;


import com.tc_back.routingMaster.entity.RoutingMaster;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoutingMasterDto {

    private Long routingMasterId;
    private String processCode;
    private String processName;
    private Integer processTime;
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

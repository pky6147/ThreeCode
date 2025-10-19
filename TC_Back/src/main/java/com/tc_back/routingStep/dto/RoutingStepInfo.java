package com.tc_back.routingStep.dto;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoutingStepInfo {
    private int processSeq;
    private String processCode;
    private String processName;
    private double processTime; // 혹은 BigDecimal
    private String remark;

}

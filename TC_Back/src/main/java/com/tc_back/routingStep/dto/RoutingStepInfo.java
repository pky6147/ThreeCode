package com.tc_back.routingStep.dto;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoutingStepInfo {
    private String processName;
    private int processSeq;

}

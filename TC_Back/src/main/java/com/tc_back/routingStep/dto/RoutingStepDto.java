package com.tc_back.routingStep.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoutingStepDto {
    private Long routingMasterId;
    private int processSeq;
}


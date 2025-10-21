package com.tc_back.lotProcessHistory.entity;

import com.tc_back.productInput.entity.ProductInput;
import com.tc_back.routingStep.entity.RoutingStep;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "lot_process_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LotProcessHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long lotProcessHistoryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_input_id", nullable = false)
    private ProductInput productInput;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "routing_step_id")
    private RoutingStep routingStep;

    private LocalDateTime processStart;
    private LocalDateTime processEnd;

    @Column(length = 200)
    private String remark;
}

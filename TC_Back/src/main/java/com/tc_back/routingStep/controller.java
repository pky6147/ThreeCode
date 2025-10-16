package com.tc_back.routingStep;

import com.tc_back.product.Product;
import com.tc_back.routingMaster.entity.RoutingMaster;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "routing_step")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class controller {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long routingStepId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "routing_master_id", nullable = false)
    private RoutingMaster routingMaster;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private int processSeq;
}

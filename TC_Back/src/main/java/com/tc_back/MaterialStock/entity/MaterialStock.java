package com.tc_back.MaterialStock.entity;

import com.tc_back.Material.entity.Material;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "material_stock")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaterialStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "material_stock_id")
    private Long materialStockId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    @Column(name = "count", nullable = false)
    private Long count;
}
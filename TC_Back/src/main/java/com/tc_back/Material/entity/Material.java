package com.tc_back.Material.entity;

import com.tc_back.Company.Company;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "material")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Material {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "material_id")
        private Long materialId;

        @ManyToOne(fetch = FetchType.LAZY) // N:1 관계 (여러 원자재가 하나의 업체에 속함)
        @JoinColumn(name = "company_id", nullable = false)
        private Company company; // 업체 id

        @Column(name = "material_name", nullable = false, length = 100)
        private String materialName; // 품목명

        @Column(name = "material_no", nullable = false, length = 50)
        private String materialNo; // 품목번호

        @Column(name = "category", nullable = false, length = 50)
        private String category; // 분류

        @Column(name = "color", length = 50)
        private String color; // 색상

        @Column(name = "spec", length = 50)
        private String spec; // 규격

        @Column(name = "spec_value", length = 100)
        private String specValue; // 제원

        @Column(name = "maker", length = 100)
        private String maker; // 제조사

        @Column(name = "is_active", nullable = false, length = 1)
        private String isActive = "Y"; // 사용여부

        @Column(name = "remark", length = 200)
        private String remark; // 비고

        @Column(name = "is_delete", nullable = false, length = 1)
        private String isDelete = "N"; // 기본값: 정상
}
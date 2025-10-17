package com.tc_back.MaterialInput.entity;

import com.tc_back.Material.entity.Material;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "material_input")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaterialInput {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "material_input_id")
        private Long materialInputId;

        @ManyToOne(fetch = FetchType.LAZY) // N:1 관계 (여러 원자재가 하나의 업체에 속함)
        @JoinColumn(name = "material_id", nullable = false)
        private Material material; // Material_id

        @Column(name = "material_input_no", length = 50, nullable = false, unique = true)
        private String materialInputNo; // 입고번호

        @Column(name = "material_input_date", nullable = false)
        private LocalDate materialInputDate; // 입고일자

        @Column(name = "make_date")
        private LocalDate makeDate; // 제조일자

        @Column(name = "material_input_qty", nullable = false)
        private Integer materialInputQty; // 입고수량

        @Column(name = "total", precision = 10, scale = 2, nullable = false)
        private BigDecimal total; // 총량 = 규격 * 수량, 계산 후 저장

        @Column(name = "created_at", nullable = false, updatable = false)
        private LocalDateTime createdAt; // 생성일자

        @Column(name = "updated_at")
        private LocalDateTime updatedAt; // 수정일자

        @Column(name = "is_delete", nullable = false, length = 1)
        private String isDelete = "N"; // 상태변경/삭제, 기본값 N

        // 입고번호 및 생성일자 자동 세팅
        @PrePersist
        public void prePersist() {
            this.createdAt = LocalDateTime.now(); // 생성일자

            // total 계산: 입고수량 * specValue (문자 → 숫자)
            if (this.materialInputQty != null && this.material != null && this.material.getSpecValue() != null) {
                try {
                    BigDecimal specVal = new BigDecimal(this.material.getSpecValue());
                    this.total = specVal.multiply(BigDecimal.valueOf(this.materialInputQty));
                } catch (NumberFormatException e) {
                    this.total = BigDecimal.ZERO; // 숫자가 아니면 0
                }
            } else {
                this.total = BigDecimal.ZERO;
            }
        }

        @PreUpdate
        public void preUpdate() {
            this.updatedAt = LocalDateTime.now();
        }
}
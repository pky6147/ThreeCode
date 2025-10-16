package com.tc_back.ProductOutput;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_output")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductOutput {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_output_id")
    private Long productOutputId;

    @Column(name = "product_input_id", nullable = false)
    private Long productInputId; // FK

    @Column(name = "product_output_no", nullable = false, length = 50, unique = true)
    private String productOutputNo; // 출고번호 자동생성

    @Column(name = "product_output_qty", nullable = false)
    private Integer productOutputQty;

    @Column(name = "product_output_date", nullable = false)
    private LocalDate productOutputDate;

    @Column(name = "remark", length = 200)
    private String remark;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_delete", nullable = false, length = 1)
    private String isDelete = "N"; // Y=삭제

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.isDelete == null) { // isDelete도 혹시 null일 경우 대비
            this.isDelete = "N";
        }
    }

    // 엔티티가 업데이트되기 전에 호출되어 updated_at에 현재 시각을 자동 설정합니다.
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
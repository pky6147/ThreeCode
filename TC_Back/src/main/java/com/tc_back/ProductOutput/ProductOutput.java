package com.tc_back.ProductOutput;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_ouput")
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
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_delete", nullable = false, length = 1)
    private String isDelete = "N"; // Y=삭제
}
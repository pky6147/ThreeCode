package com.tc_back.MaterialOutput.entity;

import com.tc_back.Material.entity.Material;
import com.tc_back.MaterialInput.entity.MaterialInput;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "material_output")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaterialOutput {

    /** PK */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "material_output_id")
    private Long materialOutputId;

    /** FK : Material */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    /** FK : MaterialInput */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_input_id", nullable = false)
    private MaterialInput materialInput;

    /** 출고번호 (자동생성: MOUT-yyyyMMdd-001) */
    @Column(name = "material_output_no", length = 50, nullable = false)
    private String materialOutputNo;

    /** 출고일자 */
    @Column(name = "material_output_date", nullable = false)
    private LocalDate materialOutputDate;

    /** 출고수량 */
    @Column(name = "material_output_qty", nullable = false)
    private Integer materialOutputQty;

    /** 생성일자 (자동 기록) */
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /** 수정일자 (자동 갱신) */
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /** 삭제여부 (Y=삭제, N=정상) */
    @Column(name = "is_delete", length = 1, nullable = false)
    private String isDelete = "N";

}
package com.tc_back.routingMaster.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "routing_master")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoutingMaster {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "routing_master_id")
        private Long routingMasterId;

        @Column(name = "process_code", nullable = false, length = 20, unique = true)
        private String processCode; // 공정 코드

        @Column(name = "process_name", nullable = false, length = 50)
        private String processName; // 공정명

        @Column(name = "process_time", nullable = false)
        private Integer processTime; // 공정 시간 (분 단위)

        @Column(name = "process_order", nullable = false)
        private Integer processOrder; // 공정 순서

        @Column(name = "remark", length = 200)
        private String remark; // 비고

        @Column(name = "is_delete", nullable = false, length = 1)
        private String isDelete = "N"; // Y=삭제, N=정상
}
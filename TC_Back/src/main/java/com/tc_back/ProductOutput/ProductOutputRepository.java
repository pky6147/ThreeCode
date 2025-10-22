package com.tc_back.ProductOutput;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProductOutputRepository extends JpaRepository<ProductOutput, Long> {

    // 특정 입고 ID 기준 출고 조회 (입고별 출고 이력 조회)
    List<ProductOutput> findByProductInputIdAndIsDelete(Long productInputId, String isDelete);

    // 삭제되지 않은 전체 출고 목록 조회
    List<ProductOutput> findByIsDelete(String isDelete);

    // 출고번호 기준 조회
    ProductOutput findByProductOutputNoAndIsDelete(String productOutputNo, String isDelete);

    // 출고 수 카운트 (출고번호 생성용)
    long countByProductOutputDate(LocalDate productOutputDate);

    List<ProductOutput> findByProductInputId(Long productInputId);
}
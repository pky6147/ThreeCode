package com.tc_back.productInput;

import com.tc_back.productInput.entity.ProductInput;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ProductInputRepository extends JpaRepository<ProductInput, Long> {
    // 오늘 생성된 입고 수량을 조회해서 LOT 번호 생성용 시퀀스 확인
    @Query("SELECT COUNT(p) FROM ProductInput p WHERE p.createdAt BETWEEN :start AND :end")
    long countByToday(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // 삭제 되지 않은 입고 전체 조회
    List<ProductInput> findByIsDelete(String isDelete);

    // 출고되지 않은 입고 목록 조회
    @Query("""
        SELECT p 
        FROM ProductInput p 
        WHERE p.isDelete = :isDelete
        AND p.productInputId NOT IN (
            SELECT o.productInputId 
            FROM ProductOutput o 
            WHERE o.isDelete = 'N'
        )
        """)
    List<ProductInput> findAvailableInputs(@Param("isDelete") String isDelete);
}

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

    List<ProductInput> findByIsDelete(String isDelete);
}

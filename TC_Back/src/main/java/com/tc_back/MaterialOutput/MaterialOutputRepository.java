package com.tc_back.MaterialOutput;

import com.tc_back.MaterialOutput.entity.MaterialOutput;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MaterialOutputRepository extends JpaRepository<MaterialOutput, Long> {

    /**
     * 출고번호 중복 체크
     */
    boolean existsByMaterialOutputNoAndIsDelete(String materialOutputNo, String isDelete);

    /**
     * 날짜별 마지막 시퀀스 조회용 (출고번호 생성 시 사용)
     * 예: 20251020-001 이런 형식으로 자동 번호 생성할 때 사용
     */
    // 날짜별 마지막 시퀀스 조회 (삭제 여부 상관 없이)
    Optional<MaterialOutput> findTopByMaterialOutputNoStartingWithOrderByMaterialOutputNoDesc(String prefix);

    List<MaterialOutput> findByIsDeleteOrderByMaterialOutputNoDesc(String isDelete);

    // 🔹 출고번호가 특정 날짜로 시작하는 가장 마지막 번호 조회
    @Query("SELECT m.materialOutputNo FROM MaterialOutput m WHERE m.materialOutputNo LIKE :prefix ORDER BY m.materialOutputNo DESC")
    List<String> findLastOutputNoByDate(@Param("prefix") String prefix, org.springframework.data.domain.Pageable pageable);
}
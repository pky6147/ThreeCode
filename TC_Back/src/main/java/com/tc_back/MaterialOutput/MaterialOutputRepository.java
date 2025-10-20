package com.tc_back.MaterialOutput;

import com.tc_back.MaterialOutput.entity.MaterialOutput;
import org.springframework.data.jpa.repository.JpaRepository;
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

    // 출고 현황 조회
    List<MaterialOutput> findByIsDeleteOrderByMaterialOutputNoDesc(String isDelete);
}
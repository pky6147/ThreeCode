package com.tc_back.MaterialInput;

import com.tc_back.MaterialInput.entity.MaterialInput;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MaterialInputRepository extends JpaRepository<MaterialInput, Long> {
    // 입고번호 중복 체크
    boolean existsByMaterialInputNoAndIsDelete(String materialInputNo, String isDelete);

    // 날짜별 마지막 시퀀스 조회용 (입고번호 생성 시)
    Optional<MaterialInput> findTopByMaterialInputNoStartingWithAndIsDeleteOrderByMaterialInputNoDesc(String prefix, String isDelete);
}

package com.tc_back.lotProcessHistory;

import com.tc_back.lotProcessHistory.entity.LotProcessHistory;
import com.tc_back.productInput.entity.ProductInput;
import com.tc_back.routingStep.entity.RoutingStep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LotProcessHistoryRepository extends JpaRepository<LotProcessHistory, Long> {
    @Query("SELECT A FROM LotProcessHistory A " +
            "JOIN FETCH A.routingStep B " +
            "JOIN FETCH B.routingMaster C " +
            "WHERE A.productInput.productInputId = :productInputId " +
            "ORDER BY B.processSeq")
    List<LotProcessHistory> findByProductInputIdWithRoutingSteps(@Param("productInputId") Long productInputId);
    boolean existsByProductInputAndRoutingStep(ProductInput productInput, RoutingStep routingStep);


}

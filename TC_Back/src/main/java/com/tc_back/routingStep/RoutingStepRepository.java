package com.tc_back.routingStep;

import com.tc_back.product.Product;
import com.tc_back.routingStep.entity.RoutingStep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoutingStepRepository extends JpaRepository<RoutingStep,Long> {
    void deleteByProduct(Product product);
    Optional<RoutingStep> findByProduct_ProductIdAndProcessSeq(Long productId, int processSeq);
}

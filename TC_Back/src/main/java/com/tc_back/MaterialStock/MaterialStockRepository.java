package com.tc_back.MaterialStock;

import com.tc_back.MaterialStock.entity.MaterialStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialStockRepository extends JpaRepository<MaterialStock, Long> {

    MaterialStock findByMaterial_MaterialId(Long materialId);
}
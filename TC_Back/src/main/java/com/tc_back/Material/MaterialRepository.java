package com.tc_back.Material;

import com.tc_back.Material.entity.Material;
import com.tc_back.routingMaster.entity.RoutingMaster;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialRepository extends JpaRepository<Material, Long> {
    //중복코드
    boolean existsByMaterialNoAndIsDelete(String materialNo, String isDelete);
    boolean existsByMaterialNoAndIsDeleteAndMaterialIdNot(String materialNo, String isDelete, Long materialId);
}

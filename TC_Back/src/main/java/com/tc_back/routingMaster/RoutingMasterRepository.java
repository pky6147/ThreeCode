package com.tc_back.routingMaster;

import com.tc_back.routingMaster.entity.RoutingMaster;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoutingMasterRepository extends JpaRepository<RoutingMaster,Long> {
    //중복코드
    boolean existsByProcessCode(String processCode);
    boolean existsByProcessCodeAndIsDeleteAndRoutingMasterIdNot(String processCode, String isDelete, Long id);


}

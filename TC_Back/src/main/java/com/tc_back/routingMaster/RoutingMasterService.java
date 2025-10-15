package com.tc_back.routingMaster;


import com.tc_back.routingMaster.dto.RoutingMasterDto;
import com.tc_back.routingMaster.entity.RoutingMaster;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoutingMasterService {

    private final RoutingMasterRepository routingMasterRepository;

    //등록
    public RoutingMasterDto create(RoutingMasterDto routingMasterDto) {

        RoutingMaster entity = routingMasterDto.toEntity();
        RoutingMaster saved = routingMasterRepository.save(entity);
        return RoutingMasterDto.fromEntity(saved);
    }
    //전체조회
    public List<RoutingMasterDto> findAll() {
        return routingMasterRepository.findAll().stream()
                .filter(x -> "N".equals(x.getIsDelete()))
                .map(RoutingMasterDto::fromEntity)
                .collect(Collectors.toList());
    }
    //수정
    public RoutingMasterDto update(Long routingMasterId, RoutingMasterDto dto) {
        RoutingMaster entity = routingMasterRepository.findById(routingMasterId)
                .orElseThrow(() -> new RuntimeException("해당 아이디" + routingMasterId + "의 라우팅을 찾을 수 없습니다."));

        if ("Y".equals(entity.getIsDelete()))
            throw new RuntimeException("삭제된 라우팅은 수정할 수 없습니다.");

        entity.setProcessCode(dto.getProcessCode());
        entity.setProcessName(dto.getProcessName());
        entity.setProcessTime(dto.getProcessTime());
        entity.setProcessOrder(dto.getProcessOrder());
        entity.setRemark(dto.getRemark());

        RoutingMaster saved = routingMasterRepository.save(entity);
        return RoutingMasterDto.fromEntity(saved);

    }

    //삭제
    public void delete(Long routingMasterId) {
        RoutingMaster entity = routingMasterRepository.findById(routingMasterId)
                .orElseThrow(() -> new RuntimeException("해당 아이디 " + routingMasterId + "를 찾을 수 없습니다."));
        entity.setIsDelete("Y");
        routingMasterRepository.save(entity);
    }




}

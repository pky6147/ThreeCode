package com.tc_back.routingMaster;

import com.tc_back.routingMaster.dto.RoutingMasterDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RoutingMasterController {

    private final RoutingMasterService routingMasterService;


    //등록
    @PostMapping("/routing-master")
    public ResponseEntity<RoutingMasterDto> create(@RequestBody RoutingMasterDto dto) {
        RoutingMasterDto saved = routingMasterService.create(dto);
        return ResponseEntity.ok(saved);
    }

    //전체조회
    @GetMapping("/routing-master")
    public ResponseEntity<List<RoutingMasterDto>> findAll() {
        List<RoutingMasterDto> saved = routingMasterService.findAll();
        return ResponseEntity.ok(saved);
    }

    //수정
    @PutMapping("/routing-master/{id}")
    public ResponseEntity<RoutingMasterDto> update(@PathVariable Long id, @RequestBody RoutingMasterDto dto) {
        RoutingMasterDto saved = routingMasterService.update(id, dto);
        return ResponseEntity.ok(saved);
    }
    //삭제
    @DeleteMapping("/routing-master/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        routingMasterService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

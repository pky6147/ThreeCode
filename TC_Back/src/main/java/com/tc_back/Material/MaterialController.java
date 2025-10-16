package com.tc_back.Material;

import com.tc_back.Material.dto.MaterialDto;
import com.tc_back.routingMaster.dto.RoutingMasterDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/material") // 공통 경로 지정

public class MaterialController {

    private final MaterialService materialService;

    //전체조회
    @GetMapping
    public ResponseEntity<List<MaterialDto>> findAll() {
        List<MaterialDto> materials = materialService.findAll();
        return ResponseEntity.ok(materials);
    }

    //등록
    @PostMapping
    public ResponseEntity<MaterialDto> create(@RequestBody @Valid MaterialDto dto) {
        MaterialDto saved = materialService.create(dto);
        return ResponseEntity.ok(saved);
    }

    //수정
    @PutMapping("/{id}")
    public ResponseEntity<MaterialDto> update(@PathVariable Long id,
                                              @RequestBody @Valid MaterialDto dto) {
        MaterialDto updated = materialService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    //삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        materialService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

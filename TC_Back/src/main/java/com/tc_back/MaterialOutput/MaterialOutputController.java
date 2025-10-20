package com.tc_back.MaterialOutput;

import com.tc_back.MaterialOutput.dto.MaterialOutputDto;
import com.tc_back.MaterialOutput.MaterialOutputService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/material-output")
@RequiredArgsConstructor
public class MaterialOutputController {

    private final MaterialOutputService materialOutputService;

    /** 1️⃣ 출고 등록 */
    @PostMapping
    public ResponseEntity<MaterialOutputDto> createOutput(@RequestBody MaterialOutputDto dto) {
        MaterialOutputDto saved = materialOutputService.create(dto);
        return ResponseEntity.ok(saved);
    }

    /** 2️⃣ 등록화면 조회 (재고 있는 입고 목록) */
    @GetMapping("/available")
    public ResponseEntity<List<MaterialOutputDto>> getAvailableForOutput() {
        List<MaterialOutputDto> list = materialOutputService.findAvailableForOutput();
        return ResponseEntity.ok(list);
    }

    /** 3️⃣ 출고 현황 조회 */
    @GetMapping
    public ResponseEntity<List<MaterialOutputDto>> getAllOutputs() {
        List<MaterialOutputDto> list = materialOutputService.findAllOutputs();
        return ResponseEntity.ok(list);
    }

    /** 4️⃣ 출고 삭제 */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOutput(@PathVariable("id") Long materialOutputId) {
        materialOutputService.delete(materialOutputId);
        return ResponseEntity.noContent().build();
    }

    /** 5️⃣ 출고 수정 */
    @PutMapping("/{id}")
    public ResponseEntity<MaterialOutputDto> updateOutput(
            @PathVariable("id") Long materialOutputId,
            @RequestBody MaterialOutputDto dto) {

        MaterialOutputDto updated = materialOutputService.update(materialOutputId, dto);
        return ResponseEntity.ok(updated);
    }
}
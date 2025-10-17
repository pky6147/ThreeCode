package com.tc_back.MaterialInput;

import com.tc_back.MaterialInput.dto.MaterialInputDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/material-input")
@RequiredArgsConstructor
public class MaterialInputController {

    private final MaterialInputService materialInputService;

    // 1️⃣ 전체 조회
    @GetMapping
    public ResponseEntity<List<MaterialInputDto>> getAll() {
        List<MaterialInputDto> list = materialInputService.findAll();
        return ResponseEntity.ok(list);
    }

    // 2️⃣ 단일 등록
    @PostMapping
    public ResponseEntity<MaterialInputDto> create(@RequestBody MaterialInputDto dto) {
        MaterialInputDto saved = materialInputService.create(dto);
        return ResponseEntity.ok(saved);
    }

    // 3️⃣ 수정
    @PutMapping("/{id}")
    public ResponseEntity<MaterialInputDto> update(
            @PathVariable Long id,
            @RequestBody MaterialInputDto dto) {
        MaterialInputDto updated = materialInputService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    // 4️⃣ 삭제 (논리 삭제)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        materialInputService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
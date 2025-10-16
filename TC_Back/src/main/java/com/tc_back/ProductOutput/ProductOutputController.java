package com.tc_back.ProductOutput;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product-output")
@RequiredArgsConstructor
public class ProductOutputController {

    private final ProductOutputService productOutputService;

    // 출고 등록
    @PostMapping
    public ResponseEntity<ProductOutput> createOutput(@RequestBody ProductOutputDto dto) {
        ProductOutput created = productOutputService.createOutput(dto);
        return ResponseEntity.ok(created);
    }

    //전체 출고 목록 조회 (삭제되지 않은 것만)
    @GetMapping
    public ResponseEntity<List<ProductOutput>> getAllOutputs() {
        List<ProductOutput> outputs = productOutputService.getAllOutputs();
        return ResponseEntity.ok(outputs);
    }

    //출고 단건 조회
    @GetMapping("/{id}")
    public ResponseEntity<ProductOutput> getOutputById(@PathVariable Long id) {
        ProductOutput output = productOutputService.getOutputById(id);
        return ResponseEntity.ok(output);
    }

    //출고 수정 (출고수량, 출고일자)
    @PutMapping("/{id}")
    public ResponseEntity<ProductOutput> updateOutput(
            @PathVariable Long id,
            @RequestBody ProductOutputDto dto) {

        ProductOutput updated = productOutputService.updateOutput(id, dto);
        return ResponseEntity.ok(updated);
    }

    //출고 삭제 (Soft Delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOutput(@PathVariable Long id) {
        productOutputService.softDeleteOutput(id);
        return ResponseEntity.ok("출고 정보가 삭제되었습니다.");
    }
}
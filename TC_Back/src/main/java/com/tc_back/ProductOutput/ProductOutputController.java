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
    public ResponseEntity<ProductOutputDto> createOutput(@RequestBody ProductOutputDto dto) {
        ProductOutputDto created = productOutputService.createOutputDto(dto);
        return ResponseEntity.ok(created);
    }

    //전체 출고 목록 조회 (삭제되지 않은 것만)
    @GetMapping
    public ResponseEntity<List<ProductOutputDto>> getAllOutputs() {
        List<ProductOutputDto> outputs = productOutputService.getAllOutputDtos();
        return ResponseEntity.ok(outputs);
    }

    //출고 단건 조회
    @GetMapping("/{id}")
    // 반환 타입을 ProductOutputDto로 변경하고 Service의 DTO 메서드를 호출
    public ResponseEntity<ProductOutputDto> getOutputById(@PathVariable Long id) {
        ProductOutputDto output = productOutputService.getOutputDtoById(id);
        return ResponseEntity.ok(output);
    }

    //출고 수정 (출고수량, 출고일자)
    @PutMapping("/{id}")
    public ResponseEntity<ProductOutputDto> updateOutput(
            @PathVariable Long id,
            @RequestBody ProductOutputDto dto) {
        ProductOutputDto updated = productOutputService.updateOutput(id, dto);
        return ResponseEntity.ok(updated);
    }

    //출고 삭제 (Soft Delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOutput(@PathVariable Long id) {
        productOutputService.softDeleteOutput(id);
        return ResponseEntity.ok("출고 정보가 삭제되었습니다.");
    }
}
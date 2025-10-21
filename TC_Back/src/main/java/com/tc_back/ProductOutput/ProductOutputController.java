package com.tc_back.ProductOutput;

import com.tc_back.ProductOutput.dto.ProductOutputRequestDto;
import com.tc_back.ProductOutput.dto.ProductOutputResponseDto;
import com.tc_back.ProductOutput.dto.ProductOutputUpdateDto;
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
    public ResponseEntity<ProductOutputResponseDto> createOutput(
            @RequestBody ProductOutputRequestDto requestDto) {

        ProductOutputResponseDto created = productOutputService.createOutput(requestDto);
        return ResponseEntity.ok(created);
    }

    //전체 출고 목록 조회 (삭제되지 않은 것만)
    @GetMapping
    public ResponseEntity<List<ProductOutputResponseDto>> getAllOutputs() {
        List<ProductOutputResponseDto> outputs = productOutputService.getAllOutputs();
        return ResponseEntity.ok(outputs);
    }

    //출고 단건 조회
    @GetMapping("/{id}")
    public ResponseEntity<ProductOutputResponseDto> getOutputById(@PathVariable Long id) {
        ProductOutputResponseDto output = productOutputService.getOutputById(id);
        return ResponseEntity.ok(output);
    }

    //출고 수정 (출고수량, 출고일자)
    @PutMapping("/{id}")
    public ResponseEntity<ProductOutputResponseDto> updateOutput(
            @PathVariable Long id,
            @RequestBody ProductOutputUpdateDto updateDto) {

        ProductOutputResponseDto updated = productOutputService.updateOutput(id, updateDto);
        return ResponseEntity.ok(updated);
    }

    //출고 삭제 (Soft Delete, DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOutput(@PathVariable Long id) {
        productOutputService.softDeleteOutput(id);
        return ResponseEntity.noContent().build();
    }

    // 출하증 단건 조회 (GET, Response DTO 사용)
    @GetMapping("/{id}/delivery-note")
    public ResponseEntity<ProductOutputResponseDto> getDeliveryNoteByOutputId(@PathVariable Long id) {
        ProductOutputResponseDto note = productOutputService.getDeliveryNoteById(id);
        return ResponseEntity.ok(note);
    }
}
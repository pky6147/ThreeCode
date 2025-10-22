package com.tc_back.productInput;


import com.tc_back.productInput.dto.ProductInputRequestDto;
import com.tc_back.productInput.dto.ProductInputResponseDto;
import com.tc_back.productInput.dto.ProductInputUpdateDto;
import com.tc_back.productInput.entity.ProductInput;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/product-input") // 공통 prefix 지정 (가독성 향상)
public class ProductInputController {

    private final  ProductInputService productInputService;

    // 입고 등록
    @PostMapping
    public ResponseEntity<ProductInputResponseDto> createInput(@RequestBody ProductInputRequestDto dto) {
        ProductInput saved = productInputService.createInput(dto);

        // DTO로 변환해서 반환
        ProductInputResponseDto response = new ProductInputResponseDto(
                saved.getProductInputId(),
                saved.getProduct().getProductId(),
                saved.getLotNo(),
                saved.getProduct().getCompany().getCompanyName(),
                saved.getProduct().getProductNo(),
                saved.getProduct().getProductName(),
                saved.getProduct().getPaintType(),
                saved.getProduct().getCategory(),
                saved.getProductInputQty(),
                saved.getProductInputDate()
        );
        return ResponseEntity.ok(response);
    }

    // 전체 조회
    @GetMapping
    public ResponseEntity<List<ProductInputResponseDto>> getAll() {
        return ResponseEntity.ok(productInputService.getAllProductInputs());
    }

    // 출고 가능한 입고 목록 조회
    @GetMapping("/available")
    public ResponseEntity<List<ProductInputResponseDto>> getAvailableInputs() {
        return ResponseEntity.ok(productInputService.getAvailableInputs());
    }

    // 수정
    @PutMapping("/{id}")
    public ResponseEntity<ProductInputResponseDto> updateInput(
            @PathVariable Long id,
            @RequestBody ProductInputUpdateDto dto
    ) {
        ProductInput updated = productInputService.updateInput(id, dto);

        ProductInputResponseDto response = new ProductInputResponseDto(
                updated.getProductInputId(),
                updated.getProduct().getProductId(),
                updated.getLotNo(),
                updated.getProduct().getCompany().getCompanyName(),
                updated.getProduct().getProductNo(),
                updated.getProduct().getProductName(),
                updated.getProduct().getCategory(),
                updated.getProduct().getPaintType(),
                updated.getProductInputQty(),
                updated.getProductInputDate()
        );

        return ResponseEntity.ok(response);
    }

    // 입고 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInput(@PathVariable Long id) {
        productInputService.deleteInput(id);
        return ResponseEntity.noContent().build();
    }
}

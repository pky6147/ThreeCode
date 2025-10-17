package com.tc_back.product;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tc_back.product.dto.*;
import com.tc_back.routingStep.dto.RoutingStepDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    //등록
    @PostMapping("/product")
    public Product createProduct(@ModelAttribute ProductDto dto) {
        return productService.createProduct(dto);
    }
    //첫화면조회
    @GetMapping("/product")
    public List<ProductListDto> findAllProduct() {
        return productService.findAll();
    }
    //상세조회
    @GetMapping("/product/{id}")
    public ProductResponseDto getProductDetail(@PathVariable Long id) {
        return productService.findDetail(id);
    }
    //수정
    @PutMapping("/product/{id}")
    public ProductResponseDto updateProduct(@PathVariable Long id,
                                            @ModelAttribute ProductUpdateForm form) throws Exception {

        // JSON 문자열을 List<RoutingStepDto>로 변환
        List<RoutingStepDto> routingSteps = null;
        if (form.getRoutingStepsJson() != null && !form.getRoutingStepsJson().isEmpty()) {
            ObjectMapper mapper = new ObjectMapper();
            routingSteps = mapper.readValue(
                    form.getRoutingStepsJson(),
                    new TypeReference<List<RoutingStepDto>>() {}
            );
        }

        return productService.updateProduct(
                id,
                form.toUpdateDto(routingSteps),
                form.getImages()
        );
    }
    //삭제
    @DeleteMapping("/product/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok("삭제되었습니다.");
    }

}

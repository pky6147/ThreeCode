package com.tc_back.product;

import com.tc_back.product.dto.ProductDto;
import com.tc_back.product.dto.ProductListDto;
import com.tc_back.product.dto.ProductResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping("/product")
    public Product createProduct(@ModelAttribute ProductDto dto) {
        return productService.createProduct(dto);
    }

    @GetMapping("/product")
    public List<ProductListDto> findAllProduct() {
        return productService.findAll();
    }

    @GetMapping("/product/{id}")
    public ProductResponseDto getProductDetail(@PathVariable Long id) {
        return productService.findDetail(id);
    }
}

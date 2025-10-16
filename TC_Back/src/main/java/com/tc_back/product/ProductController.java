package com.tc_back.product;

import com.tc_back.product.dto.ProductDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping("/product")
    public Product createProduct(@RequestBody ProductDto dto) {
        return productService.createProduct(dto);
    }
}

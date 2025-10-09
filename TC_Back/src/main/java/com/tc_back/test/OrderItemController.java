package com.tc_back.test;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
public class OrderItemController {

    private final OrderItemService orderItemService;

    @PostMapping("/order-items")
    public ResponseEntity<String> createOrderItem(
            @RequestParam String name,
            @RequestParam String itemCode,
            @RequestParam String category,
            @RequestParam MultipartFile[] images
    ) {
        orderItemService.createOrderItem(name, itemCode, category, images);
        return ResponseEntity.ok("등록 완료");
    }

}

package com.tc_back.MaterialStock;

import com.tc_back.MaterialStock.dto.MaterialStockDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/material-stock")
@RequiredArgsConstructor
public class MaterialStockController {

    private final MaterialStockService materialStockService;

    /** ✅ 전체 재고 현황 조회 */
    @GetMapping
    public ResponseEntity<List<MaterialStockDto>> getAllStock() {
        List<MaterialStockDto> stockList = materialStockService.getAllStock();
        return ResponseEntity.ok(stockList);
    }
}
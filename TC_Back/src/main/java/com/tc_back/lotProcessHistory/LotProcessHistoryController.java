package com.tc_back.lotProcessHistory;

import com.tc_back.lotProcessHistory.dto.CompletedProductInputDto;
import com.tc_back.lotProcessHistory.dto.LotProcessHistoryDto;
import com.tc_back.lotProcessHistory.dto.LotProcessUpdateDto;
import com.tc_back.productInput.ProductInputRepository;
import com.tc_back.productInput.entity.ProductInput;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class LotProcessHistoryController {

    private final LotProcessHistoryService lotProcessHistoryService;
    private final ProductInputRepository productInputRepository;
    private final LotProcessHistoryRepository lotProcessHistoryRepository;

    //품목별 공정조회
    @GetMapping("/lot-process/{id}")
    public ResponseEntity<List<LotProcessHistoryDto>> getLotProcess(@PathVariable Long id) {
        return ResponseEntity.ok(lotProcessHistoryService.getLotProcessHistory(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<LotProcessHistoryDto> updateLotProcess(
            @PathVariable Long id,
            @RequestBody LotProcessUpdateDto dto) {

        return ResponseEntity.ok(lotProcessHistoryService.updateLotProcess(id, dto));
    }
    // 공정 완료된 수주품목 조회
    @GetMapping("/completed")
    public ResponseEntity<List<CompletedProductInputDto>> getCompletedProductInputs() {
        return ResponseEntity.ok(lotProcessHistoryService.getCompletedProductInputs());
    }
}

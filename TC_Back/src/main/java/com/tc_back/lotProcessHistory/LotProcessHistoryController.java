package com.tc_back.lotProcessHistory;

import com.tc_back.lotProcessHistory.dto.LotProcessHistoryDto;
import com.tc_back.lotProcessHistory.dto.LotProcessUpdateDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class LotProcessHistoryController {

    private final LotProcessHistoryService lotProcessHistoryService;

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
}

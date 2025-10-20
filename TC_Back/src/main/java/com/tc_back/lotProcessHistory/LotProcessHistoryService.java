package com.tc_back.lotProcessHistory;

import com.tc_back.lotProcessHistory.dto.LotProcessHistoryDto;
import com.tc_back.lotProcessHistory.dto.LotProcessUpdateDto;
import com.tc_back.lotProcessHistory.entity.LotProcessHistory;
import com.tc_back.productInput.ProductInputRepository;
import com.tc_back.productInput.entity.ProductInput;
import com.tc_back.routingStep.entity.RoutingStep;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LotProcessHistoryService {

    private final LotProcessHistoryRepository lotProcessHistoryRepository;
    private final ProductInputRepository productInputRepository;
    
    //최초공정 자동생성
    @Transactional
    public List<LotProcessHistoryDto> getLotProcessHistory(Long productInputId) {
        List<LotProcessHistory> histories = lotProcessHistoryRepository.findByProductInputIdWithRoutingSteps(productInputId);

        if (histories.isEmpty()) {
            // 최초 조회 → processSeq = 1 공정 자동 생성
            ProductInput input = productInputRepository.findById(productInputId)
                    .orElseThrow(() -> new RuntimeException("입고 이력이 없습니다."));

            RoutingStep firstStep = input.getProduct().getRoutingSteps().stream()
                    .filter(rs -> rs.getProcessSeq() == 1)
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("라우팅 스텝이 존재하지 않습니다."));

            LotProcessHistory newHistory = LotProcessHistory.builder()
                    .productInput(input)
                    .routingStep(firstStep)
                    .processStart(null)
                    .processEnd(null)
                    .remark(null)
                    .build();

            lotProcessHistoryRepository.save(newHistory);
            histories = List.of(newHistory);
        }

        return histories.stream()
                .map(h -> {
                    var rm = h.getRoutingStep().getRoutingMaster();
                    return LotProcessHistoryDto.builder()
                            .processName(rm.getProcessName())
                            .processCode(rm.getProcessCode())
                            .processTime(rm.getProcessTime())
                            .processSeq(h.getRoutingStep().getProcessSeq())
                            .processStart(h.getProcessStart())
                            .processEnd(h.getProcessEnd())
                            .remark(h.getRemark())
                            .build();
                })
                .collect(Collectors.toList());
    }

    //수정하고 다음공정
    @Transactional
    public LotProcessHistoryDto updateLotProcess(Long lotProcessHistoryId, LotProcessUpdateDto lotProcessHistoryDto) {
        LotProcessHistory history = lotProcessHistoryRepository.findById(lotProcessHistoryId)
                .orElseThrow(() -> new RuntimeException("해당 " + lotProcessHistoryId + "의 공정이 존재하지 않습니다."));

        if(lotProcessHistoryDto.getProcessStart() != null) {
            history.setProcessStart(lotProcessHistoryDto.getProcessStart());
        }
        if(lotProcessHistoryDto.getProcessEnd() != null) {
            history.setProcessEnd(lotProcessHistoryDto.getProcessEnd());
        }
        if(lotProcessHistoryDto.getRemark() != null) {
            history.setRemark(lotProcessHistoryDto.getRemark());
        }
        lotProcessHistoryRepository.save(history);

        var rm = history.getRoutingStep().getRoutingMaster();
        return LotProcessHistoryDto.builder()
                .processName(rm.getProcessName())
                .processCode(rm.getProcessCode())
                .processTime(rm.getProcessTime())
                .processSeq(history.getRoutingStep().getProcessSeq())
                .processStart(history.getProcessStart())
                .processEnd(history.getProcessEnd())
                .remark(history.getRemark())
                .build();
    }
}

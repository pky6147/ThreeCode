package com.tc_back.lotProcessHistory;

import com.tc_back.ProductOutput.ProductOutput;
import com.tc_back.ProductOutput.ProductOutputRepository;
import com.tc_back.lotProcessHistory.dto.LotProcessHistoryDto;
import com.tc_back.lotProcessHistory.dto.LotProcessUpdateDto;
import com.tc_back.lotProcessHistory.entity.LotProcessHistory;
import com.tc_back.product.Product;
import com.tc_back.productInput.ProductInputRepository;
import com.tc_back.productInput.entity.ProductInput;
import com.tc_back.routingStep.RoutingStepRepository;
import com.tc_back.routingStep.entity.RoutingStep;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LotProcessHistoryService {

    private final LotProcessHistoryRepository lotProcessHistoryRepository;
    private final RoutingStepRepository routingStepRepository;
    private final ProductInputRepository productInputRepository;
    private final ProductOutputRepository productOutputRepository;

    // 최초 공정 자동 생성
    @Transactional
    public List<LotProcessHistoryDto> getLotProcessHistory(Long productInputId) {
        List<LotProcessHistory> histories = lotProcessHistoryRepository.findByProductInputIdWithRoutingSteps(productInputId);

        if (histories.isEmpty()) {
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

    // 공정 수정 + 다음 공정 자동 생성 + 전체 완료 시 출고 생성
    @Transactional
    public LotProcessHistoryDto updateLotProcess(Long lotProcessHistoryId, LotProcessUpdateDto lotProcessHistoryDto) {
        LotProcessHistory history = lotProcessHistoryRepository.findById(lotProcessHistoryId)
                .orElseThrow(() -> new RuntimeException("해당 " + lotProcessHistoryId + "의 공정이 존재하지 않습니다."));

        if (lotProcessHistoryDto.getProcessStart() != null) {
            history.setProcessStart(lotProcessHistoryDto.getProcessStart());
        }
        if (lotProcessHistoryDto.getProcessEnd() != null) {
            history.setProcessEnd(lotProcessHistoryDto.getProcessEnd());
        }
        if (lotProcessHistoryDto.getRemark() != null) {
            history.setRemark(lotProcessHistoryDto.getRemark());
        }
        lotProcessHistoryRepository.save(history);

        // 공정 완료되면 다음 공정 생성 시도
        if (lotProcessHistoryDto.getProcessEnd() != null) {
            boolean nextCreated = createNextProcess(history);

            // 다음 공정이 없었다면 = 마지막 공정 완료 → 출고 자동 생성
            if (!nextCreated) {
                createProductOutput(history.getProductInput());
            }
        }

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

    /**
     * 다음 공정 생성. 없으면 false 반환.
     */
    private boolean createNextProcess(LotProcessHistory completed) {
        ProductInput productInput = completed.getProductInput();
        Product product = productInput.getProduct();
        int nextSeq = completed.getRoutingStep().getProcessSeq() + 1;

        return routingStepRepository.findByProduct_ProductIdAndProcessSeq(product.getProductId(), nextSeq)
                .map(nextStep -> {
                    boolean exists = lotProcessHistoryRepository.existsByProductInputAndRoutingStep(productInput, nextStep);
                    if (!exists) {
                        LotProcessHistory nextHistory = LotProcessHistory.builder()
                                .productInput(productInput)
                                .routingStep(nextStep)
                                .processStart(null)
                                .processEnd(null)
                                .build();
                        lotProcessHistoryRepository.save(nextHistory);
                    }
                    return true;
                })
                .orElse(false); // 다음 공정이 없음 → 마지막 공정
    }

    /**
     * 모든 공정 완료 시 ProductOutput 자동 생성
     */
    private void createProductOutput(ProductInput input) {
        String outputNo = generateOutputNo();

        ProductOutput output = ProductOutput.builder()
                .productInputId(input.getProductInputId())
                .productOutputNo(outputNo)
                .productOutputQty(input.getProductInputQty()) // 입고수량 그대로
                .productOutputDate(LocalDate.now())
                .createdAt(LocalDateTime.now())
                .isDelete("N")
                .build();

        productOutputRepository.save(output);
    }

    private String generateOutputNo() {
        LocalDate today = LocalDate.now();
        String datePart = today.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = productOutputRepository.countByProductOutputDate(today);
        return "OUT-" + datePart + "-" + String.format("%03d", count + 1);
    }
}
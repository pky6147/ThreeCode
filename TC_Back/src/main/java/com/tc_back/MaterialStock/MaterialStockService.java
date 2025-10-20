package com.tc_back.MaterialStock;

import com.tc_back.MaterialStock.entity.MaterialStock;
import com.tc_back.MaterialStock.dto.MaterialStockDto;
import com.tc_back.Material.MaterialRepository;
import com.tc_back.MaterialInput.MaterialInputRepository;
import com.tc_back.MaterialOutput.MaterialOutputRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaterialStockService {

    private final MaterialStockRepository materialStockRepository;
    private final MaterialInputRepository materialInputRepository;
    private final MaterialOutputRepository materialOutputRepository;
    private final MaterialRepository materialRepository;

    // 전체 재고 현황 조회
    public List<MaterialStockDto> getAllStock() {
        return materialRepository.findAll().stream()
                .map(material -> {
                    Long materialId = material.getMaterialId();

                    // 입고 수량 총합
                    long totalInput = materialInputRepository.findAll().stream()
                            .filter(i -> "N".equals(i.getIsDelete()))
                            .filter(i -> i.getMaterial().getMaterialId().equals(materialId))
                            .mapToLong(i -> i.getMaterialInputQty().longValue())
                            .sum();

                    // 출고 수량 총합
                    long totalOutput = materialOutputRepository.findAll().stream()
                            .filter(o -> "N".equals(o.getIsDelete()))
                            .filter(o -> o.getMaterial().getMaterialId().equals(materialId))
                            .mapToLong(o -> o.getMaterialOutputQty().longValue())
                            .sum();

                    long stockCount = totalInput - totalOutput;

                    if (stockCount <= 0) return null; // 재고가 없는 건 제외

                    return MaterialStockDto.builder()
                            .materialId(materialId)
                            .materialName(material.getMaterialName())
                            .materialNo(material.getMaterialNo())
                            .spec(material.getSpec())
                            .maker(material.getMaker())
                            .companyId(material.getCompany() != null ? material.getCompany().getCompanyId() : null)
                            .companyName(material.getCompany() != null ? material.getCompany().getCompanyName() : null)
                            .count(stockCount)
                            .build();
                })
                .filter(dto -> dto != null)
                .collect(Collectors.toList());
    }
}
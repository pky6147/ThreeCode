package com.tc_back.MaterialInput;

import com.tc_back.Company.Company;
import com.tc_back.Company.CompanyRepository;
import com.tc_back.Material.entity.Material;
import com.tc_back.Material.MaterialRepository;
import com.tc_back.MaterialInput.dto.MaterialInputDto;
import com.tc_back.MaterialInput.entity.MaterialInput;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MaterialInputService {

    private final MaterialInputRepository materialInputRepository;
    private final MaterialRepository materialRepository;
    private final CompanyRepository companyRepository;

    // 등록
    public MaterialInputDto create(MaterialInputDto dto) {
        // 1️⃣ Material 조회
        Material material = materialRepository.findById(dto.getMaterialId())
                .orElseThrow(() -> new RuntimeException("해당 자재를 찾을 수 없습니다."));

        // 2️⃣ 총량 계산 (입고수량 * specValue)
        BigDecimal specValue = new BigDecimal(material.getSpecValue() != null ? material.getSpecValue() : "0");
        BigDecimal total = specValue.multiply(new BigDecimal(dto.getMaterialInputQty()));
        dto.setTotal(total);

        // 3️⃣ 입고번호 자동 생성
        String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String prefix = "MINC-" + today + "-";

        // 오늘 날짜 기준 마지막 번호 조회
        MaterialInput lastInput = materialInputRepository
                .findTopByMaterialInputNoStartingWithAndIsDeleteOrderByMaterialInputNoDesc(prefix, "N")
                .orElse(null);

        int nextSeq = 1;
        if (lastInput != null) {
            String lastNo = lastInput.getMaterialInputNo();
            String seqStr = lastNo.substring(lastNo.lastIndexOf("-") + 1);
            nextSeq = Integer.parseInt(seqStr) + 1;
        }
        String materialInputNo = prefix + String.format("%03d", nextSeq);
        dto.setMaterialInputNo(materialInputNo);

        // 4️⃣ DTO → Entity 변환
        MaterialInput entity = dto.toEntity(material);

        // 5️⃣ DB 저장
        MaterialInput saved = materialInputRepository.save(entity);

        // 6️⃣ Entity → DTO 변환 후 반환
        return MaterialInputDto.fromEntity(saved);
    }
    // 전체조회
    public List<MaterialInputDto> findAll() {
        return materialInputRepository.findAll().stream()
                .filter(input -> "N".equals(input.getIsDelete()))
                .map(MaterialInputDto::fromEntity)
                .collect(Collectors.toList());
    }

    // 수정
    public MaterialInputDto update(Long materialInputId, MaterialInputDto dto) {
        MaterialInput entity = materialInputRepository.findById(materialInputId)
                .orElseThrow(() -> new RuntimeException("해당 입고 데이터를 찾을 수 없습니다."));

        Material material = materialRepository.findById(dto.getMaterialId())
                .orElseThrow(() -> new RuntimeException("해당 자재를 찾을 수 없습니다."));
        entity.setMaterial(material);

        entity.setMaterialInputDate(dto.getMaterialInputDate());
        entity.setMakeDate(dto.getMakeDate());
        entity.setMaterialInputQty(dto.getMaterialInputQty());

        // 총량 계산
        BigDecimal specValue = new BigDecimal(material.getSpecValue() != null ? material.getSpecValue() : "0");
        entity.setTotal(specValue.multiply(new BigDecimal(dto.getMaterialInputQty())));

        MaterialInput saved = materialInputRepository.save(entity);
        return MaterialInputDto.fromEntity(saved);
    }

    // 삭제
    public void delete(Long materialInputId) {
        MaterialInput entity = materialInputRepository.findById(materialInputId)
                .orElseThrow(() -> new RuntimeException("해당 입고 데이터를 찾을 수 없습니다."));
        entity.setIsDelete("Y");
        materialInputRepository.save(entity);
    }
}

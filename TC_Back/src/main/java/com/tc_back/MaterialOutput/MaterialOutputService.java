package com.tc_back.MaterialOutput;

import com.tc_back.Company.Company;
import com.tc_back.Company.CompanyRepository;
import com.tc_back.Material.entity.Material;
import com.tc_back.Material.MaterialRepository;
import com.tc_back.MaterialInput.entity.MaterialInput;
import com.tc_back.MaterialInput.MaterialInputRepository;
import com.tc_back.MaterialOutput.dto.MaterialOutputDto;
import com.tc_back.MaterialOutput.entity.MaterialOutput;
import com.tc_back.MaterialOutput.MaterialOutputRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MaterialOutputService {

    private final MaterialOutputRepository materialOutputRepository;
    private final MaterialInputRepository materialInputRepository;
    private final MaterialRepository materialRepository;
    private final CompanyRepository companyRepository;

    /** 1️⃣ 출고 등록 */
    public MaterialOutputDto create(MaterialOutputDto dto) {
        Material material = materialRepository.findById(dto.getMaterialId())
                .orElseThrow(() -> new RuntimeException("해당 자재를 찾을 수 없습니다."));

        MaterialInput materialInput = materialInputRepository.findById(dto.getMaterialInputId())
                .orElseThrow(() -> new RuntimeException("해당 입고 정보를 찾을 수 없습니다."));

        // 출고번호 자동 생성
        String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String prefix = "MOUT-" + today + "-";

        MaterialOutput lastOutput = materialOutputRepository
                .findTopByMaterialOutputNoStartingWithOrderByMaterialOutputNoDesc(prefix)
                .orElse(null);

        int nextSeq = 1;
        if (lastOutput != null) {
            String lastNo = lastOutput.getMaterialOutputNo();
            String seqStr = lastNo.substring(lastNo.lastIndexOf("-") + 1);
            nextSeq = Integer.parseInt(seqStr) + 1;
        }
        String materialOutputNo = prefix + String.format("%03d", nextSeq);
        dto.setMaterialOutputNo(materialOutputNo);

        // 출고 등록
        MaterialOutput entity = dto.toEntity(material, materialInput);
        MaterialOutput saved = materialOutputRepository.save(entity);

        return MaterialOutputDto.fromEntity(saved);
    }

    /** 2️⃣ 등록화면 조회 (재고 있는 입고만) */
    public List<MaterialOutputDto> findAvailableForOutput() {
        // 모든 입고건 조회 (삭제 안 된 것)
        List<MaterialInput> inputs = materialInputRepository.findAll().stream()
                .filter(input -> "N".equals(input.getIsDelete()))
                .collect(Collectors.toList());

        return inputs.stream()
                .map(input -> {
                    // 해당 입고건의 출고 총합
                    int totalOutputQty = materialOutputRepository.findAll().stream()
                            .filter(o -> o.getMaterialInput().getMaterialInputId().equals(input.getMaterialInputId()))
                            .filter(o -> "N".equals(o.getIsDelete()))
                            .mapToInt(MaterialOutput::getMaterialOutputQty)
                            .sum();

                    int remainQty = input.getMaterialInputQty() - totalOutputQty;
                    if (remainQty <= 0) return null;

                    Material material = input.getMaterial();
                    Company company = material.getCompany();

                    return MaterialOutputDto.builder()
                            .materialInputId(input.getMaterialInputId())
                            .materialInputNo(input.getMaterialInputNo())
                            .materialId(material.getMaterialId())
                            .materialName(material.getMaterialName())
                            .materialNo(material.getMaterialNo())
                            .spec(material.getSpec())
                            .maker(material.getMaker())
                            .companyId(company != null ? company.getCompanyId() : null)
                            .companyName(company != null ? company.getCompanyName() : null)
                            .remainQty(remainQty) // DTO에 새 필드 추가 필요
                            .build();
                })
                .filter(dto -> dto != null)
                .collect(Collectors.toList());
    }

    /** 3️⃣ 출고현황 조회 */
    public List<MaterialOutputDto> findAllOutputs() {
        return materialOutputRepository.findByIsDeleteOrderByMaterialOutputNoDesc("N").stream()
                .map(MaterialOutputDto::fromEntity)
                .collect(Collectors.toList());
    }

    /** 4️⃣ 출고 삭제 (soft delete) */
    public void delete(Long materialOutputId) {
        MaterialOutput entity = materialOutputRepository.findById(materialOutputId)
                .orElseThrow(() -> new RuntimeException("해당 출고 데이터를 찾을 수 없습니다."));
        entity.setIsDelete("Y");
        materialOutputRepository.save(entity);
    }
    /** 5️⃣ 출고 수정 */
    public MaterialOutputDto update(Long materialOutputId, MaterialOutputDto dto) {
        // 1. 기존 출고 데이터 조회
        MaterialOutput entity = materialOutputRepository.findById(materialOutputId)
                .orElseThrow(() -> new RuntimeException("해당 출고 데이터를 찾을 수 없습니다."));

        // 2. 출고일자, 출고수량 수정
        entity.setMaterialOutputDate(dto.getMaterialOutputDate());
        entity.setMaterialOutputQty(dto.getMaterialOutputQty());

        // 3. 저장 후 DTO 반환
        MaterialOutput updated = materialOutputRepository.save(entity);
        return MaterialOutputDto.fromEntity(updated);
    }
}
package com.tc_back.Material;


import com.tc_back.Company.Company;
import com.tc_back.Company.CompanyRepository;
import com.tc_back.Material.dto.MaterialDto;
import com.tc_back.Material.entity.Material;
import com.tc_back.routingMaster.dto.RoutingMasterDto;
import com.tc_back.routingMaster.entity.RoutingMaster;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final CompanyRepository companyRepository;

    //등록
    public MaterialDto create(MaterialDto dto) {
        // 1️⃣ 중복 체크
        boolean exists = materialRepository.existsByMaterialNoAndIsDelete(dto.getMaterialNo(), "N");
        if (exists) {
            throw new RuntimeException("품목번호 " + dto.getMaterialNo() + " 는 이미 존재합니다.");
        }
        // 2️⃣ 업체 확인 (외래키)
        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new RuntimeException("해당 업체가 존재하지 않습니다."));

        // 3️⃣ DTO → Entity 변환
        Material entity = dto.toEntity(company);

        // 4️⃣ DB 저장
        Material saved = materialRepository.save(entity);
        // 5️⃣ Entity → DTO 변환 후 반환
        return MaterialDto.fromEntity(saved);
    }
    //전체조회
    public List<MaterialDto> findAll() {
        return materialRepository.findAll().stream()
                .filter(material -> "N".equals(material.getIsDelete())) // isDelete가 N인것만
                .map(MaterialDto::fromEntity) // Entity -> DTO 변환
                .collect(Collectors.toList()); // List로 반환
    }
    //수정
    public MaterialDto update(Long materialId, MaterialDto dto) {

        // 동일 품목코드가 존재하는지(본인 제외)
        boolean exits = materialRepository.existsByMaterialNoAndIsDeleteAndMaterialIdNot(dto.getMaterialNo(),"N",materialId );
        if (exits) {
            throw new RuntimeException("품목코드 " + dto.getMaterialNo() + "가 이미 존재합니다.");

        }

        // 수정 대상 엔티티 조회
        Material entity = materialRepository.findById(materialId)
                .orElseThrow(() -> new RuntimeException("해당 아이디" + materialId + "의 자재를 찾을 수 없습니다."));


        // Company 엔티티 조회 후 반영
        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new RuntimeException("업체를 찾을 수 없습니다."));

        entity.setCompany(company);

        entity.setMaterialNo(dto.getMaterialNo());
        entity.setMaterialName(dto.getMaterialName());
        entity.setCategory(dto.getCategory());
        entity.setColor(dto.getColor());
        entity.setSpec(dto.getSpec());
        entity.setSpecValue(dto.getSpecValue());
        entity.setMaker(dto.getMaker());
        entity.setIsActive(dto.getIsActive());
        entity.setRemark(dto.getRemark());

        Material saved = materialRepository.save(entity);
        return MaterialDto.fromEntity(saved);
    }

    //삭제
    public void delete(Long materialId) {
        Material entity = materialRepository.findById(materialId)
                .orElseThrow(() -> new RuntimeException("해당 아이디 " + materialId + "의 자재를 찾을 수 없습니다."));

        entity.setIsDelete("Y");

        materialRepository.save(entity);
    }




}

package com.tc_back.Company;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CompanyService {

    private final CompanyRepository companyRepository;

    /**
     * 목록 및 검색
     * - 검색 조건: 업체유형, 업체명, 대표명
     * - 조회 항목: 업체유형, 업체명, 대표명, 전화번호, 주소, 비고
     */
//    @Transactional(readOnly = true)
//    public List<CompanyDto> findAll(CompanyDto searchDto) {
//        List<Company> companies;
//
//        // 간단한 검색 기능 (null 체크)
//        if ((searchDto.getCompanyType() == null || searchDto.getCompanyType().isEmpty())
//                && (searchDto.getCompanyName() == null || searchDto.getCompanyName().isEmpty())
//                && (searchDto.getCeoName() == null || searchDto.getCeoName().isEmpty())) {
//            companies = companyRepository.findAllByIsDelete("N");
//        } else {
//            companies = companyRepository.findBySearchConditions(
//                    searchDto.getCompanyType(),
//                    searchDto.getCompanyName(),
//                    searchDto.getCeoName()
//            );
//        }
//
//        return companies.stream()
//                .map(this::toListDto)
//                .collect(Collectors.toList());
//    }

    //상세 조회
    @Transactional(readOnly = true)
    public CompanyDto getCompanyDetail(Long companyId) {
        Company company = companyRepository.findByCompanyIdAndIsDelete(companyId, "N")
                .orElseThrow(() -> new IllegalArgumentException("해당 업체를 찾을 수 없습니다. id=" + companyId));
        return toDetailDto(company);
    }

    //등록
    public CompanyDto addCompany(CompanyDto companyDto) {
        Company company = toEntity(companyDto);
        Company saved = companyRepository.save(company);
        return toDetailDto(saved);
    }

    //수정 (기존정보, 상세정보, 사용여부 수정)
    public CompanyDto updateCompany(CompanyDto companyDto) {
        Company company = companyRepository.findByCompanyIdAndIsDelete(companyDto.getCompanyId(), "N")
                .orElseThrow(() -> new IllegalArgumentException("해당 업체를 찾을 수 없습니다. id=" + companyDto.getCompanyId()));

        company.setCompanyType(companyDto.getCompanyType());
        company.setCompanyName(companyDto.getCompanyName());
        company.setCeoName(companyDto.getCeoName());
        company.setCeoPhone(companyDto.getCeoPhone());
        company.setAddress(companyDto.getAddress());
        company.setRemark(companyDto.getRemark());
        company.setContactName(companyDto.getContactName());
        company.setContactPhone(companyDto.getContactPhone());
        company.setContactEmail(companyDto.getContactEmail());
        company.setIsActive(companyDto.getIsActive());

        return toDetailDto(companyRepository.save(company));
    }

    //삭제 (Soft Delete)
    public Long deleteCompany(Long companyId) {
        Company company = companyRepository.findByCompanyIdAndIsDelete(companyId, "N")
                .orElseThrow(() -> new IllegalArgumentException("해당 업체를 찾을 수 없습니다. id=" + companyId));

        company.setIsDelete("Y"); // soft delete
        companyRepository.save(company);
        return companyId;
    }


    // Mapper Methods (Entity ↔ DTO)
    private CompanyDto toListDto(Company company) {
        return CompanyDto.builder()
                .companyId(company.getCompanyId())
                .companyType(company.getCompanyType())
                .companyName(company.getCompanyName())
                .ceoName(company.getCeoName())
                .ceoPhone(company.getCeoPhone())
                .address(company.getAddress())
                .remark(company.getRemark())
                .isActive(company.getIsActive())
                .build();
    }

    private CompanyDto toDetailDto(Company company) {
        return CompanyDto.builder()
                .companyId(company.getCompanyId())
                .companyType(company.getCompanyType())
                .companyName(company.getCompanyName())
                .ceoName(company.getCeoName())
                .ceoPhone(company.getCeoPhone())
                .address(company.getAddress())
                .remark(company.getRemark())
                .isActive(company.getIsActive())
                .contactName(company.getContactName())
                .contactPhone(company.getContactPhone())
                .contactEmail(company.getContactEmail())
                .build();
    }

    private Company toEntity(CompanyDto dto) {
        return Company.builder()
                .companyType(dto.getCompanyType())
                .companyName(dto.getCompanyName())
                .ceoName(dto.getCeoName())
                .ceoPhone(dto.getCeoPhone())
                .contactName(dto.getContactName())
                .contactPhone(dto.getContactPhone())
                .contactEmail(dto.getContactEmail())
                .address(dto.getAddress())
                .remark(dto.getRemark())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : "Y")
                .isDelete("N")
                .build();
    }
}

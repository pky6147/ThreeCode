package com.tc_back.Company;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    //목록 및 조회 (검색 아직)
    @GetMapping("/company")
        public List<CompanyDto> getCompanies() {
            return companyService.findAll();
        }

    //상세 조회
    @GetMapping("/{companyId}")
    public CompanyDto getCompanyDetail(@PathVariable Long companyId) {
        return companyService.getCompanyDetail(companyId);          //업체명 클릭시 상세 정보 열람
    }

    //등록
    @PostMapping("/{companyId}")
    public CompanyDto addCompnay(@RequestBody CompanyDto companyDto) {
        return companyService.addCompany(companyDto);
    }

    //수정
    @PutMapping("/{companyId}")
    public CompanyDto updateCompany(@PathVariable Long companyId, @RequestBody CompanyDto companyDto) {
        companyDto.setCompanyId(companyId);
        return companyService.updateCompany(companyDto);
    }

    //삭제
    @DeleteMapping("/{companyId}")
    public Long deleteCompany(@PathVariable Long companyId) {
        return companyService.deleteCompany(companyId);
    }

}

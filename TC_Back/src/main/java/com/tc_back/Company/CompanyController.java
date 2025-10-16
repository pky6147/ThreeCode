package com.tc_back.Company;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    //목록 및 조회 검색
//    @GetMapping
//        public List<CompanyDto> getCompanies(@ModelAttribute CompanyDto searchDto) {
//            return companyService.findAll(searchDto);
//        }

    //상세 조회
    @GetMapping("/{companyId}")
    public CompanyDto getCompanyDetail(@PathVariable Long companyId) {
        return companyService.getCompanyDetail(companyId);          //업체명 클릭시 상세 정보 열람
    }

    //등록
    @PostMapping
    public CompanyDto addCompnay(@RequestBody CompanyDto companyDto) {
        return companyService.addCompany(companyDto);
    }

    //수정
    @PutMapping
    public CompanyDto updateCompany(@RequestBody CompanyDto companyDto) {
        return companyService.updateCompany(companyDto);
    }

    //삭제
    @DeleteMapping("/{companyId}")
    public Long deleteCompany(@PathVariable Long companyId) {
        return companyService.deleteCompany(companyId);
    }

}

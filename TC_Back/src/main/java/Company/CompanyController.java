package Company;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class CompanyController {

    //업체 등록 서비스
    public final CompanyService companyService;
    private final CompanyRepository companyRepository;

    @GetMapping(value = "/company")
        public List<CompanyDto> getComany() {
            return CompanyService.findAll();
        }

    //등록
    @PostMapping("/company")
    public CompanyDto addCompnay(@RequestBody CompanyDto companyDto) {
        return companyService.addCompany(companyDto);
    }

    //수정
    @PostMapping("/company")
    public CompanyDto updateCompany(@RequestBody CompanyDto companyDto) {
        return companyService.updateCompany(companyDto);
    }

    //삭제
    @PutMapping("/company")
    public CompanyDto deleteCompany(@PathVariable("companyId") Long companyId {
        return companyService.deleteCompany(companyId);
    }

}

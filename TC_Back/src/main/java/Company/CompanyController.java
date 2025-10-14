package Company;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class CompanyController {

    //업체 등록 서비스
    public final CompanyService companyService;

    @GetMapping(value = "//")

}

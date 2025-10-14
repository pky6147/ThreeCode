package Company;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CompanyService {

    public List<CompanyDto> findAll() {
        List<CompanyDto> companyDtos = new ArrayList<>();
        for(Company company : companyRepository.findAll()) {
            CompanyDto companyDto = CompanyDto.builder()

        }
    }

}

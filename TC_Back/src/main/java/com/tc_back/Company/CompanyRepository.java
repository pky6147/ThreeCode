package com.tc_back.Company;

import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface CompanyRepository extends CrudRepository<Company, Long> {

    List<Company> findAllByIsDelete(String isDelete);

    Optional<Company> findByCompanyIdAndIsDelete(Long companyId, String isDelete);

//    List<Company> findBySearchConditions(String companyType, String companyName, String ceoName);

}

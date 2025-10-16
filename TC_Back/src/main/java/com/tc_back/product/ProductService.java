package com.tc_back.product;

import com.tc_back.Company.Company;
import com.tc_back.Company.CompanyRepository;
import com.tc_back.img.ProductImgRepository;
import com.tc_back.product.dto.ProductDto;
import com.tc_back.routingMaster.RoutingMasterRepository;
import com.tc_back.routingMaster.entity.RoutingMaster;
import com.tc_back.routingStep.RoutingStepRepository;
import com.tc_back.routingStep.dto.RoutingStepDto;
import com.tc_back.routingStep.entity.RoutingStep;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductImgRepository productImgRepository;
    private final RoutingStepRepository routingStepRepository;
    private final RoutingMasterRepository routingMasterRepository;
    private final CompanyRepository companyRepository;

    @Transactional
    public Product createProduct(ProductDto dto) {
        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new RuntimeException("업체를 찾을 수 없습니다."));


        Product product = Product.builder()
                .company(company)
                .paintType(dto.getPaintType())
                .productName(dto.getProductName())
                .productNo(dto.getProductNo())
                .category(dto.getCategory())
                .price(dto.getPrice())
                .color(dto.getColor())
                .isActive("Y")
                .isDelete("N")
                .remark(dto.getRemark())
                .build();

        Product saved = productRepository.save(product);

        //라우팅스텝저장
        if (dto.getRoutingSteps() != null) {
            List<Long> selectedIds = dto.getRoutingSteps()
                    .stream()
                    .map(RoutingStepDto::getRoutingMasterId)
                    .collect(Collectors.toList());

            List<RoutingMaster> masters = routingMasterRepository.findAllById(selectedIds);

            masters.sort(Comparator.comparingInt(RoutingMaster::getProcessOrder));

            if (masters.size() != selectedIds.size()) {
                throw new RuntimeException("존재하지 않는 라우팅마스터 ID가 있습니다.");
            }

            int seq = 1;
            for (RoutingMaster master : masters) {
                RoutingStep step = RoutingStep.builder()
                        .product(saved)
                        .routingMaster(master)
                        .processSeq(seq++)
                        .build();
                routingStepRepository.save(step);
            }
        }
        return saved;
    }
}

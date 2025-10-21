package com.tc_back.productInput;


import com.tc_back.product.Product;
import com.tc_back.product.ProductRepository;
import com.tc_back.productInput.dto.ProductInputRequestDto;
import com.tc_back.productInput.dto.ProductInputResponseDto;
import com.tc_back.productInput.dto.ProductInputUpdateDto;
import com.tc_back.productInput.entity.ProductInput;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductInputService {

    private final ProductInputRepository productInputRepository;
    private final ProductRepository productRepository;

    //입고등록
    public ProductInput createInput(ProductInputRequestDto dto) {
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductInput input = new ProductInput();
        input.setProduct(product);               // ← product_id FK 저장
        input.setProductInputQty(dto.getProductInputQty());
        input.setProductInputDate(dto.getProductInputDate());
        input.setLotNo(generateLotNo());
        input.setIsDelete("N");
        input.setCreatedAt(LocalDateTime.now());

        return productInputRepository.save(input);
    }
    //lotNo 자동생성
    private String generateLotNo() {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.atTime(23, 59, 59);
        long count = productInputRepository.countByToday(start, end) + 1;
        return String.format("LOT-%s-%03d", today.format(DateTimeFormatter.ofPattern("yyyyMMdd")), count);
    }
    //전체조회
    public List<ProductInputResponseDto> getAllProductInputs() {
        List<ProductInput> list = productInputRepository.findByIsDelete("N");

        return list.stream()
                .map(pi -> new ProductInputResponseDto(
                        pi.getProductInputId(),
                        pi.getLotNo(),
                        pi.getProduct().getCompany().getCompanyName(),
                        pi.getProduct().getProductNo(),
                        pi.getProduct().getProductName(),
                        pi.getProduct().getPaintType(),
                        pi.getProduct().getCategory(),
                        pi.getProductInputQty(),
                        pi.getProductInputDate()
                ))
                .collect(Collectors.toList());
    }
    //수정
    @Transactional
    public ProductInput updateInput(Long id, ProductInputUpdateDto dto) {
        ProductInput input = productInputRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("입고 이력이 존재하지 않습니다."));

        if (dto.getProductInputQty() != null && dto.getProductInputQty() > 0) {
            input.setProductInputQty(dto.getProductInputQty());
        }

        if (dto.getProductInputDate() != null && !dto.getProductInputDate().isAfter(LocalDate.now())) {
            input.setProductInputDate(dto.getProductInputDate());
        }

        return productInputRepository.save(input);
    }
    //삭제
    @Transactional
    public void deleteInput(Long id) {
        ProductInput input = productInputRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("입고 이력이 존재하지 않습니다."));

        input.setIsDelete("Y");  // 실제 삭제 X, 상태 변경
        productInputRepository.save(input);
    }

    // 단건 조회 후 DTO 반환
    public ProductInputResponseDto getInputById(Long id) {
        ProductInput input = productInputRepository.findById(id)
                .filter(i -> "N".equals(i.getIsDelete()))
                .orElseThrow(() -> new RuntimeException("입고 정보를 찾을 수 없습니다. ID=" + id));

        return ProductInputResponseDto.builder()
                .productInputId(input.getProductInputId())
                .lotNo(input.getLotNo())
                .companyName(input.getProduct().getCompany().getCompanyName())
                .productNo(input.getProduct().getProductNo())
                .productName(input.getProduct().getProductName())
                .category(input.getProduct().getCategory())
                .paintType(input.getProduct().getPaintType())
                .productInputQty(input.getProductInputQty())
                .productInputDate(input.getProductInputDate())
                .build();
    }

    // 출고 가능한 입고 목록 조회 (출고되지 않고, 공정상태가 '최종'인 경우만)
    public List<ProductInputResponseDto> getAvailableInputs() {
        List<ProductInput> inputs = productInputRepository.findAvailableInputs("N");

        return inputs.stream()
                .map(pi -> new ProductInputResponseDto(
                        pi.getProductInputId(),
                        pi.getLotNo(),
                        pi.getProduct().getCompany().getCompanyName(),
                        pi.getProduct().getProductNo(),
                        pi.getProduct().getProductName(),
                        pi.getProduct().getCategory(),
                        pi.getProduct().getPaintType(),
                        pi.getProductInputQty(),
                        pi.getProductInputDate()
                ))
                .collect(Collectors.toList());
    }

}

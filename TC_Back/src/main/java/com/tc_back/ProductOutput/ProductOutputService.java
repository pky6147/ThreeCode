package com.tc_back.ProductOutput;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductOutputService {

    private final ProductOutputRepository repository;
//    private final ProductInputRepository productInputRepository;
// private final ProductRepository productRepository;

    /* 출고 등록 (DTO로 반환) */
    public ProductOutputDto createOutputDto(ProductOutputDto dto) {
        ProductOutput entity = createOutput(dto); // 내부 메서드 재사용
        return convertToDto(entity);
    }

    /* 출고 등록 (엔티티 생성) */
    private ProductOutput createOutput(ProductOutputDto dto) {
        String outputNo = generateOutputNo();

        ProductOutput entity = ProductOutput.builder()
                .productInputId(dto.getProductInputId())
                .productOutputNo(outputNo)
                .productOutputQty(dto.getProductOutputQty())
                .productOutputDate(dto.getProductOutputDate() != null ? dto.getProductOutputDate() : LocalDate.now())
                .remark(dto.getRemark())
                .isDelete("N")
                .build();

        return repository.save(entity);
    }

    /* 전체 출고 목록 조회 (삭제되지 않은 데이터만) */
    public List<ProductOutputDto> getAllOutputDtos() {
        List<ProductOutput> outputs = repository.findByIsDelete("N");

        return outputs.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /* 출고 단건 조회 */
    public ProductOutputDto getOutputDtoById(Long id) {
        ProductOutput output = getOutputEntityById(id);
        return convertToDto(output);
    }

    /* 출고 수정 (출고수량, 출고일자, remark) */
    public ProductOutputDto updateOutput(Long id, ProductOutputDto dto) {
        ProductOutput existing = getOutputEntityById(id);

        if (dto.getProductOutputQty() != null) existing.setProductOutputQty(dto.getProductOutputQty());
        if (dto.getProductOutputDate() != null) existing.setProductOutputDate(dto.getProductOutputDate());
        if (dto.getRemark() != null) existing.setRemark(dto.getRemark());

        existing.setUpdatedAt(LocalDateTime.now());
        ProductOutput updated = repository.save(existing);

        return convertToDto(updated);
    }

    /* Soft Delete */
    public void softDeleteOutput(Long id) {
        ProductOutput output = getOutputEntityById(id);
        output.setIsDelete("Y");
        output.setUpdatedAt(LocalDateTime.now());
        repository.save(output);
    }

    /* 엔티티 단건 조회 */
    private ProductOutput getOutputEntityById(Long id) {
        return repository.findById(id)
                .filter(o -> o.getIsDelete().equals("N"))
                .orElseThrow(() -> new IllegalArgumentException("출고 정보를 찾을 수 없습니다. ID=" + id));
    }

    /* DTO 변환 (연관 정보 포함) */
    private ProductOutputDto convertToDto(ProductOutput output) {
        return ProductOutputDto.builder()
                .productInputId(output.getProductInputId())
                .productOutputNo(output.getProductOutputNo())
                .productOutputQty(output.getProductOutputQty())
                .productOutputDate(output.getProductOutputDate())
                .remark(output.getRemark())
                .build();
    }

    /* 출고번호 자동 생성 (오늘 기준 카운트) */
    private String generateOutputNo() {
        LocalDate today = LocalDate.now();
        long countToday = repository.countByProductOutputDate(today); // Repository에 구현 필요
        return String.format("OUT-%s-%04d", today.toString().replace("-", ""), countToday + 1);
    }

    public ProductOutputDto getDeliveryNoteByOutputId(Long id) {
        // 기존 단건 조회 로직 재사용
        ProductOutputDto output = getOutputDtoById(id);

        // 수신인, 주소, 연락처 등은 프론트에서 입력 가능하게 빈값으로 세팅
        if (output != null) {
            output.setRemark("");          // 필요시 출하증 용도로 초기화
            // 나머지 필드들은 DTO에 이미 있음
        }

        return output;
    }
}

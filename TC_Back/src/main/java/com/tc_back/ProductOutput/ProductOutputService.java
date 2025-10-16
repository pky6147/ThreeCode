package com.tc_back.ProductOutput;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductOutputService {

    private final ProductOutputRepository repository;

    /* 출고 등록
    * - 출고번호 자동 생성 (예: OUT-20251016-0001)
    * - 출고일자는 없을 경우 LocalDate.now()로 설정 */
    public ProductOutput createOutput(ProductOutputDto dto) {
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
    public List<ProductOutput> getAllOutputs() {
        return repository.findByIsDelete("N");
    }

    /* 출고 단건 조회 */
    public ProductOutput getOutputById(Long id) {
        return repository.findById(id)
                .filter(o -> o.getIsDelete().equals("N"))
                .orElseThrow(() -> new IllegalArgumentException("출고 정보를 찾을 수 없습니다. ID=" + id));
    }

    /* 출고 수정 (출고수량, 출고일자 변경) */
    public ProductOutput updateOutput(Long id, ProductOutputDto dto) {
        ProductOutput existing = getOutputById(id);

        if (dto.getProductOutputQty() != null) {
            existing.setProductOutputQty(dto.getProductOutputQty());
        }
        if (dto.getProductOutputDate() != null) {
            existing.setProductOutputDate(dto.getProductOutputDate());
        }
        if (dto.getRemark() != null) {
            existing.setRemark(dto.getRemark());
        }

        existing.setUpdatedAt(java.time.LocalDateTime.now());
        return repository.save(existing);
    }

    /* 출고 Soft Delete */
    public void softDeleteOutput(Long id) {
        ProductOutput output = getOutputById(id);
        output.setIsDelete("Y");
        output.setUpdatedAt(java.time.LocalDateTime.now());
        repository.save(output);
    }

    /* 출고번호 자동 생성 로직(형식: OUT-YYYYMMDD-0001) */
    private String generateOutputNo() {
        String today = LocalDate.now().toString().replace("-", "");
        long countToday = repository.count(); // 단순 카운트 (실무에서는 날짜별 count 로직 가능)
        return String.format("OUT-%s-%04d", today, countToday + 1);
    }
}
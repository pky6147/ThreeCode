package com.tc_back.ProductOutput;

import com.tc_back.ProductOutput.dto.ProductOutputRequestDto;
import com.tc_back.ProductOutput.dto.ProductOutputResponseDto;
import com.tc_back.ProductOutput.dto.ProductOutputUpdateDto;
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

    /* 출고 등록 (DTO로 반환) */
    public ProductOutputResponseDto createOutput(ProductOutputRequestDto requestDto) {
        String outputNo = generateOutputNo();

        ProductOutput entity = ProductOutput.builder()
                .productInputId(requestDto.getProductInputId())
                .productOutputNo(outputNo)
                .productOutputQty(requestDto.getProductOutputQty())
                .productOutputDate(requestDto.getProductOutputDate() != null
                        ? requestDto.getProductOutputDate() : LocalDate.now())
                .remark(requestDto.getRemark())
                .isDelete("N")
                .build();

        ProductOutput saved = repository.save(entity);
        return convertToResponseDto(saved);
    }


    /* 전체 출고 목록 조회 (삭제되지 않은 데이터만) */
    public List<ProductOutputResponseDto> getAllOutputs() {
        return repository.findByIsDelete("N").stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    /* 출고 단건 조회 */
    public ProductOutputResponseDto getOutputById(Long id) {
        ProductOutput output = getOutputEntityById(id);
        return convertToResponseDto(output);
    }

    /* 출고 수정 (출고수량, 출고일자, remark) */
    public ProductOutputResponseDto updateOutput(Long id, ProductOutputUpdateDto updateDto) {
        ProductOutput existing = getOutputEntityById(id);

        if (updateDto.getProductOutputQty() != null)
            existing.setProductOutputQty(updateDto.getProductOutputQty());

        if (updateDto.getProductOutputDate() != null)
            existing.setProductOutputDate(updateDto.getProductOutputDate());

        if (updateDto.getRemark() != null)
            existing.setRemark(updateDto.getRemark());

        existing.setUpdatedAt(LocalDateTime.now());
        ProductOutput updated = repository.save(existing);
        return convertToResponseDto(updated);
    }

    /* Soft Delete */
    public void softDeleteOutput(Long id) {
        ProductOutput output = getOutputEntityById(id);
        output.setIsDelete("Y");
        output.setUpdatedAt(LocalDateTime.now());
        repository.save(output);
    }

    /* 출하증 단건 조회 */
    public ProductOutputResponseDto getDeliveryNoteById(Long id) {
        ProductOutputResponseDto output = getOutputById(id);
        // 필요시 remark 초기화 등 출하증 용도로 설정
        output.setRemark("");
        return output;
    }

    /* ---------------- 내부 헬퍼 메서드 ---------------- */

    /* 엔티티 단건 조회 */
    private ProductOutput getOutputEntityById(Long id) {
        return repository.findById(id)
                .filter(o -> "N".equals(o.getIsDelete()))
                .orElseThrow(() -> new IllegalArgumentException("출고 정보를 찾을 수 없습니다. ID=" + id));
    }

    /* 엔티티 -> Response DTO 변환 */
    private ProductOutputResponseDto convertToResponseDto(ProductOutput output) {
        return ProductOutputResponseDto.builder()
                .productOutputId(output.getProductOutputId())
                .productInputId(output.getProductInputId())
                .productOutputNo(output.getProductOutputNo())
                .productOutputQty(output.getProductOutputQty())
                .productOutputDate(output.getProductOutputDate())
                .remark(output.getRemark())
                // 필요시 JOIN 데이터 추가 (companyName, productNo 등)
                .build();
    }

    /* 출고번호 자동 생성 */
    private String generateOutputNo() {
        long countToday = repository.countByProductOutputDate(LocalDate.now());
        return String.format("OUT-%s-%04d", LocalDate.now().toString().replace("-", ""), countToday + 1);
    }
}

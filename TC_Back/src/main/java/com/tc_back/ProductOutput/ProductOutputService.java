package com.tc_back.ProductOutput;

import com.tc_back.ProductOutput.dto.ProductOutputRequestDto;
import com.tc_back.ProductOutput.dto.ProductOutputResponseDto;
import com.tc_back.ProductOutput.dto.ProductOutputUpdateDto;
import com.tc_back.productInput.ProductInputService;
import com.tc_back.productInput.dto.ProductInputResponseDto;
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
    private final ProductInputService productInputService;      // 입고 정보 조회용
    // 출고 등록
    public ProductOutputResponseDto createOutput(ProductOutputRequestDto requestDto) {
        LocalDate outputDate = requestDto.getProductOutputDate() != null ? requestDto.getProductOutputDate() : LocalDate.now();

        // 1. 입고 정보 조회
        ProductInputResponseDto inputDto = productInputService.getInputById(requestDto.getProductInputId());

        // 2. 출고 수량 검증
        int totalOutputQty = repository.findByProductInputIdAndIsDelete(requestDto.getProductInputId(), "N")
                .stream().mapToInt(ProductOutput::getProductOutputQty).sum();
        int remainingQty = inputDto.getProductInputQty() - totalOutputQty;
        if (requestDto.getProductOutputQty() > remainingQty) {
            throw new IllegalArgumentException("출고 수량이 남은 입고 수량을 초과했습니다.");
        }

        // 3. 출고번호 생성
        String outputNo = generateOutputNo(outputDate);

        // 4. 엔티티 생성 및 저장
        ProductOutput entity = ProductOutput.builder()
                .productInputId(requestDto.getProductInputId())
                .productOutputNo(outputNo)
                .productOutputQty(requestDto.getProductOutputQty())
                .productOutputDate(outputDate)
                .remark(requestDto.getRemark())
                .isDelete("N")
                .build();

        ProductOutput saved = repository.save(entity);
        return convertToResponseDto(saved);
    }



    // 전체 출고 조회 (삭제되지 않은 데이터)
    public List<ProductOutputResponseDto> getAllOutputs() {
        List<ProductOutput> outputs = repository.findByIsDelete("N");
        return outputs.stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    /* 출고 단건 조회 */
    public ProductOutputResponseDto getOutputById(Long id) {
        ProductOutput output = getOutputEntityById(id);
        return convertToResponseDto(output);
    }

    // 출고 수정
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

    // Soft Delete
    public void softDeleteOutput(Long id) {
        ProductOutput output = getOutputEntityById(id);
        output.setIsDelete("Y");
        output.setUpdatedAt(LocalDateTime.now());
        repository.save(output);
    }

    // 출하증 조회
    public ProductOutputResponseDto getDeliveryNoteById(Long id) {
        ProductOutputResponseDto output = getOutputById(id);
        output.setRemark(""); // 필요 시 초기화
        return output;
    }

    /* ---------------- 내부 헬퍼 메서드 ---------------- */

    // 엔티티 조회
    private ProductOutput getOutputEntityById(Long id) {
        return repository.findById(id)
                .filter(o -> "N".equals(o.getIsDelete()))
                .orElseThrow(() -> new IllegalArgumentException("출고 정보를 찾을 수 없습니다. ID=" + id));
    }

    // 엔티티 → Response DTO 변환
    private ProductOutputResponseDto convertToResponseDto(ProductOutput output) {
        // 1. 입고 정보 조회
        ProductInputResponseDto inputDto = productInputService.getInputById(output.getProductInputId());

        // 2. DTO 변환
        return ProductOutputResponseDto.builder()
                .productOutputId(output.getProductOutputId())
                .productInputId(output.getProductInputId())
                .productOutputNo(output.getProductOutputNo())
                .productOutputQty(output.getProductOutputQty())
                .productOutputDate(output.getProductOutputDate())
                .remark(output.getRemark())
                // 입고 정보 포함
                .lotNo(inputDto.getLotNo())
                .companyName(inputDto.getCompanyName())
                .productNo(inputDto.getProductNo())
                .productName(inputDto.getProductName())
                .category(inputDto.getCategory())
                .paintType(inputDto.getPaintType())
                .productInputQty(inputDto.getProductInputQty())
                .productInputDate(inputDto.getProductInputDate())
                .build();
    }

    // 출고번호 생성 (출고일 기준 카운트)
    private String generateOutputNo(LocalDate outputDate) {
        long countToday = repository.countByProductOutputDate(outputDate);
        return String.format("OUT-%s-%04d", outputDate.toString().replace("-", ""), countToday + 1);
    }
}

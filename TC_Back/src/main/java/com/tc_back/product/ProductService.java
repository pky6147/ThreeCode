package com.tc_back.product;

import com.tc_back.Company.Company;
import com.tc_back.Company.CompanyRepository;
import com.tc_back.img.FileStorageService;
import com.tc_back.img.ProductImg;
import com.tc_back.img.ProductImgRepository;
import com.tc_back.product.dto.ProductDto;
import com.tc_back.product.dto.ProductListDto;
import com.tc_back.product.dto.ProductResponseDto;
import com.tc_back.product.dto.ProductUpdateDto;
import com.tc_back.routingMaster.RoutingMasterRepository;
import com.tc_back.routingMaster.entity.RoutingMaster;
import com.tc_back.routingStep.RoutingStepRepository;
import com.tc_back.routingStep.dto.RoutingStepDto;
import com.tc_back.routingStep.dto.RoutingStepInfo;
import com.tc_back.routingStep.entity.RoutingStep;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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
    private final FileStorageService fileStorageService;

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

        //이미지저장
        int nowimg = productImgRepository.countByProduct(product);
        if (nowimg + dto.getImages().size() > 3) {
            throw new RuntimeException("이미지는 최대 3개까지 업로드 가능합니다.");
        }

        if (dto.getImages() != null && !dto.getImages().isEmpty()) {
            int idx = 0;
            for (MultipartFile file : dto.getImages()) {
                String path = fileStorageService.storeFile(file);
                ProductImg img = ProductImg.builder()
                        .product(saved)
                        .imgPath(path)
                        .top(idx == 0 ? "Y" : "N")
                        .build();
                productImgRepository.save(img);
                idx++;
            }
        }


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


    //첫화면조회
    @Transactional(readOnly = true)
    public List<ProductListDto> findAll() {
        return productRepository.findByIsDelete("N")
                .stream()
                .map(p -> new ProductListDto(
                        p.getProductId(),
                        p.getCompany().getCompanyName(),
                        p.getProductNo(),
                        p.getProductName(),
                        p.getCategory(),
                        p.getPaintType(),
                        p.getPrice(),
                        p.getRemark(),
                        p.getIsActive()
                ))
                .collect(Collectors.toList());
    }

    //상세조회
    @Transactional(readOnly = true)
    public ProductResponseDto findDetail(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("해당 " + productId +" 품목이 없습니다."));

        List<String> images  = product.getImages().stream()
                .map(img -> img.getImgPath())
                .collect(Collectors.toList());

        List<RoutingStepInfo> steps = product.getRoutingSteps().stream()
                .sorted(Comparator.comparingInt(RoutingStep::getProcessSeq))
//                .map(rs -> new RoutingStepInfo(rs.getRoutingMaster().getProcessName(), rs.getProcessSeq()))
                .map(rs -> new RoutingStepInfo(
                        rs.getProcessSeq(),
                        rs.getRoutingMaster().getProcessCode(),   // RoutingMaster에서 가져오기
                        rs.getRoutingMaster().getProcessName(),   // RoutingMaster에서 가져오기
                        rs.getRoutingMaster().getProcessTime(),   // RoutingMaster에서 가져오기
                        rs.getRoutingMaster().getRemark()         // RoutingMaster에서 가져오기
                ))
                .collect(Collectors.toList());

        return new ProductResponseDto(
                product.getProductId(),
                product.getCompany().getCompanyName(),
                product.getPaintType(),
                product.getProductName(),
                product.getProductNo(),
                product.getCategory(),
                product.getPrice(),
                product.getColor(),
                product.getRemark(),
                product.getIsActive(),
                images,
                steps
        );
    }

    @Transactional
    public ProductResponseDto updateProduct(Long productId, ProductUpdateDto dto,
                                            List<MultipartFile> images,
                                            List<Long> productImgIds,
                                            List<String> topFlags) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("해당 품목을 찾을 수 없습니다."));

        // 1. 기본 정보 수정
        product.setPaintType(dto.getPaintType());
        product.setProductName(dto.getProductName());
        product.setProductNo(dto.getProductNo());
        product.setCategory(dto.getCategory());
        product.setPrice(dto.getPrice());
        product.setColor(dto.getColor());
        product.setRemark(dto.getRemark());
        product.setIsActive(dto.getIsActive());

        // 2. 이미지 수정/삭제/추가
        if (images != null) {
            // 1️⃣ 기존 이미지 매핑 (imgId 기준)
            for (int i = 0; i < images.size(); i++) {
                MultipartFile file = images.get(i);
                Long imgId = (productImgIds != null && productImgIds.size() > i) ? productImgIds.get(i) : null;
                String top = (topFlags != null && topFlags.size() > i) ? topFlags.get(i) : "N";

                ProductImg img;

                if (imgId != null) {
                    // 기존 이미지 수정
                    img = productImgRepository.findById(imgId)
                            .orElseThrow(() -> new RuntimeException("이미지 없음: " + imgId));

                    if (file != null && !file.isEmpty()) {
                        // 파일 교체
                        fileStorageService.deleteFile(img.getImgPath());
                        img.setImgPath(fileStorageService.storeFile(file));
                    }

                    img.setTop(top);

                } else if (file != null && !file.isEmpty()) {
                    // 새 이미지 추가
                    img = ProductImg.builder()
                            .product(product)
                            .imgPath(fileStorageService.storeFile(file))
                            .top(top)
                            .build();
                    product.getImages().add(img);
                }
            }

            // 2️⃣ 삭제 처리: productImgIds에 없는 기존 이미지는 제거
            List<Long> safeProductImgIds = (productImgIds != null) ? productImgIds : List.of();

            product.getImages().removeIf(img -> {
                if (img.getProductImgId() != null && !safeProductImgIds.contains(img.getProductImgId())) {
                    fileStorageService.deleteFile(img.getImgPath());
                    productImgRepository.delete(img);
                    return true;
                }
                return false;
            });

            // 3️⃣ top 중복 방지: Y가 2개 이상이면 첫 번째만 유지, 나머지 N으로 변경
            boolean topFound = false;
            for (ProductImg img : product.getImages()) {
                if ("Y".equals(img.getTop())) {
                    if (!topFound) topFound = true;
                    else img.setTop("N");
                }
            }
        }

        // 3. 라우팅 스텝 수정
        product.getRoutingSteps().clear(); // 기존 삭제
        if (dto.getRoutingSteps() != null) {
            int seq = 1;
            for (RoutingStepDto stepDto : dto.getRoutingSteps()) {
                if (stepDto.getRoutingMasterId() == null)
                    throw new RuntimeException("라우팅 마스터 ID가 없습니다.");

                RoutingMaster master = routingMasterRepository.findById(stepDto.getRoutingMasterId())
                        .orElseThrow(() -> new RuntimeException("라우팅 마스터 없음: " + stepDto.getRoutingMasterId()));

                RoutingStep step = RoutingStep.builder()
                        .routingMaster(master)
                        .processSeq(seq++)
                        .product(product)
                        .build();

                product.getRoutingSteps().add(step);
                routingStepRepository.save(step);
            }
        }

        // 4. DTO 변환 후 반환
        List<String> imagePaths = product.getImages().stream()
                .map(ProductImg::getImgPath)
                .collect(Collectors.toList());

        List<RoutingStepInfo> routingSteps = product.getRoutingSteps().stream()
                .sorted(Comparator.comparingInt(RoutingStep::getProcessSeq))
                .map(rs -> new RoutingStepInfo(
                        rs.getProcessSeq(),
                        rs.getRoutingMaster().getProcessCode(),
                        rs.getRoutingMaster().getProcessName(),
                        rs.getRoutingMaster().getProcessTime(),
                        rs.getRoutingMaster().getRemark()
                ))
                .collect(Collectors.toList());

        return new ProductResponseDto(
                product.getProductId(),
                product.getCompany().getCompanyName(),
                product.getPaintType(),
                product.getProductName(),
                product.getProductNo(),
                product.getCategory(),
                product.getPrice(),
                product.getColor(),
                product.getRemark(),
                product.getIsActive(),
                imagePaths,
                routingSteps
        );
    }

    //삭제
    @Transactional
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("해당 품목을 찾을 수 없습니다."));

        // 논리 삭제
        product.setIsDelete("Y");

        // JPA가 트랜잭션 끝나면 자동 flush → DB 반영
    }
}
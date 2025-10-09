package com.tc_back.test;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;
    private final OrderItemImageRepository imageRepository;
    private final FileStorageService fileStorageService;
    private final OrderItemImageRepository orderItemImageRepository;

    public void createOrderItem(String name, String itemCode, String category, MultipartFile[] images) {
        OrderItem item = new OrderItem();
        item.setName(name);
        item.setItemCode(itemCode);
        item.setCategory(category);
        orderItemRepository.save(item);


        int nowimg = orderItemImageRepository.countByOrderItem(item);
        if (nowimg + images.length > 3) {
            throw new RuntimeException("이미지는 최대 3개까지 업로드 가능합니다.");
        }


        boolean first = true;
        for (MultipartFile file : images) {
            String path = fileStorageService.storeFile(file);
            OrderItemImage img = new OrderItemImage();
            img.setOrderItem(item);
            img.setImagePath(path);
            img.setRepresentative(first);
            first = false;
            imageRepository.save(img);
        }
    }

}

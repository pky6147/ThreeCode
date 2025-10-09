package com.tc_back;

import com.tc_back.test.OrderItem;
import com.tc_back.test.OrderItemImageRepository;
import com.tc_back.test.OrderItemRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMultipartHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;



import java.util.List;

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test") // application-test.yml 적용
public class OrderItemIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private OrderItemImageRepository orderItemImageRepository;


    @Test
    void testCreateOrderItemWithImages() throws Exception {

        // 업로드할 이미지 배열
        MockMultipartFile[] files = {
                new MockMultipartFile("images", "test1.jpg", "image/jpeg", "dummy1".getBytes()),
                new MockMultipartFile("images", "test2.jpg", "image/jpeg", "dummy2".getBytes()),
                new MockMultipartFile("images", "test3.jpg", "image/jpeg", "dummy3".getBytes()),
//                new MockMultipartFile("images", "test4.jpg", "image/jpeg", "dummy4".getBytes())
        };

        // MultipartRequest Builder 생성
        MockMultipartHttpServletRequestBuilder builder =
                (MockMultipartHttpServletRequestBuilder) MockMvcRequestBuilders.multipart("/order-items")
                        .param("name", "Item1")
                        .param("itemCode", "CODE1")
                        .param("category", "CategoryA");

        // 반복문으로 파일 추가
        for (MockMultipartFile file : files) {
            builder.file(file);
        }


        mockMvc.perform(builder)
                .andExpect(status().isInternalServerError())
                .andExpect(result ->
                        assertTrue(result.getResolvedException() instanceof RuntimeException))
                .andExpect(result ->
                        assertEquals("이미지는 최대 3개까지 업로드 가능합니다.",
                                result.getResolvedException().getMessage()));

        // DB에서 확인
        List<OrderItem> items = orderItemRepository.findAll();
        assertThat(items).hasSize(1);
        OrderItem savedItem = items.get(0);

        // 이미지 개수 확인
        List<?> images = orderItemImageRepository.findByOrderItem(savedItem);
        assertThat(images).hasSize(3);

        // 대표 이미지 확인
        boolean hasRepresentative = orderItemImageRepository.findByOrderItem(savedItem)
                .stream().anyMatch(img -> ((com.tc_back.test.OrderItemImage) img).isRepresentative());
        assertThat(hasRepresentative).isTrue();

    }
}
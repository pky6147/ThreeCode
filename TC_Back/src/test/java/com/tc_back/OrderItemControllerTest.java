//package com.tc_back;
//
//
//import com.tc_back.test.OrderItemController;
//import com.tc_back.test.OrderItemService;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.mock.web.MockMultipartFile;
//import org.springframework.test.web.servlet.MockMvc;
//
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//@WebMvcTest(OrderItemController.class)
//public class OrderItemControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//    @MockBean
//    private OrderItemService orderItemService;
//
//
//    @Test
//    public void testCreateOrderItemWithMultipleImages() throws Exception {
//        MockMultipartFile image1 = new MockMultipartFile("images", "img1.png", "image/png", "내용1".getBytes());
//        MockMultipartFile image2 = new MockMultipartFile("images", "img2.png", "image/png", "내용2".getBytes());
//
//        mockMvc.perform(multipart("/order-items")
//                        .file(image1)
//                        .file(image2)
//                        .param("name", "테스트 품목")
//                        .param("itemCode", "ITEM-001")
//                        .param("category", "일반"))
//                .andExpect(status().isOk());
//    }
//}

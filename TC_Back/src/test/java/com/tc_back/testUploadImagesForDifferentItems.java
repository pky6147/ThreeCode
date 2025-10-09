package com.tc_back;


import com.tc_back.test.OrderItem;
import com.tc_back.test.OrderItemRepository;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class testUploadImagesForDifferentItems {

    private static final Logger log = LoggerFactory.getLogger(testUploadImagesForDifferentItems.class);
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private OrderItemRepository orderItemRepository;

    @Test
    void testUploadImagesForDifferentItems() throws Exception {

        mockMvc.perform(MockMvcRequestBuilders.multipart("/order-items")
                        .param("name", "Item1")
                        .param("itemCode", "CODE1")
                        .param("category", "CategoryA"))
                .andExpect(status().isOk());


        mockMvc.perform(MockMvcRequestBuilders.post("/order-items")
                        .param("name", "Item2")
                        .param("itemCode", "CODE2")
                        .param("category", "CategoryB"))
                .andExpect(status().isOk());


    }



}

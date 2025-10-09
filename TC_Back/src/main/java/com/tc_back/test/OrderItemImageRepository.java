package com.tc_back.test;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemImageRepository extends JpaRepository<OrderItemImage,Long> {
    List<OrderItemImage> findByOrderItem(OrderItem orderItem);
    int countByOrderItem(OrderItem orderitem);
}

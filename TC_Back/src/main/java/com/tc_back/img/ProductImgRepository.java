package com.tc_back.img;

import com.tc_back.product.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductImgRepository extends JpaRepository<ProductImg,Long> {
    List<ProductImg> findByProduct(Product product);
    int countByProduct(Product product);
}

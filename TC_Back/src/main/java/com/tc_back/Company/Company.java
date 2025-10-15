package com.tc_back.Company;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name = "Company")
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long companyId;      //업체아이디 (BIGINT)

    private String companyType;      //업체유형 (거래처/매입처)
    private String bizRegNo;       //사업자등록번호
    private String companyName;     //업체명
    private String ceoName;         //대표명
    private String ceoPhone;       //대표전화번호
    private String contactName;     //담당자명
    private String contactPhone;    //담당자 전화번호
    private String contactEmail;   //담당자 이메일
    private String address;        //주소


    private String isActive = "Y";    //사용여부 (Y/N)
    private String remark;         //비고
    private String isDelete = "N";    //상태변경삭제 (Y/N, soft delete)

}

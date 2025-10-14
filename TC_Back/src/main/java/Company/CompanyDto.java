package Company;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class CompanyDto {
    private Long companyId;

    //기본 정보
    private String companyType;  //업체유형 (거래처/매입처)
    private String companyName;  //업체명
    private String ceoName;      //대표명
    private Long ceoPhone;       //대표전화번호
    private String isActive;    //사용여부 (Y/N)

    //상세 정보
    private String contactName;  //담당자명
    private String contactPhone;    //담당자 전화번호
    private String contactEmail;   //담당자 이메일
    private String address;        //주소
    private String remark;         //비고


}



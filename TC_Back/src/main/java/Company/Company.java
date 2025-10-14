package Company;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Company {
    public Long companyId;      //업체아이디 (BIGINT)
    public String companyType;  //업체유형 (거래처/매입처)
    public Long bizRegNo;       //사업자등록번호
    public String companyName;  //업체명
    public String ceoName;      //대표명
    public Long ceoPhone;       //대표전화번호
    public String contactName;  //담당자명
    public Long contactPhone;    //담당자 전화번호
    public Long contactEmail;   //담당자 이메일
    public Long address;        //주소
    public String isActive;    //사용여부 (Y/N)
    public Long remark;         //비고
    public String isDelete;    //상태변경삭제 (Y/N, soft delete)

    //삭제 기능: soft delete 로직
public void softDelete() {
    this.isDelete = "Y";
    }
}



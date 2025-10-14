package Company;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import lombok.*;
import org.springframework.data.annotation.Id;

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
    public Long companyId;      //업체아이디 (BIGINT)

    public String companyType;  //업체유형 (거래처/매입처)
    public String bizRegNo;       //사업자등록번호
    public String companyName;  //업체명
    public String ceoName;      //대표명
    public String ceoPhone;       //대표전화번호
    public String contactName;  //담당자명
    public String contactPhone;    //담당자 전화번호
    public String contactEmail;   //담당자 이메일
    public String address;        //주소
    public String isActive;    //사용여부 (Y/N)
    public String remark;         //비고
    public String isDelete;    //상태변경삭제 (Y/N, soft delete)

}

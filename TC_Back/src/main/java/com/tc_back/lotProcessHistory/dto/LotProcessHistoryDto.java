package com.tc_back.lotProcessHistory.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LotProcessHistoryDto {
    private Long lotProcessHistoryId;
    private String processName;    // 라우팅 마스터 공정명
    private String processCode;    // 라우팅 마스터 공정코드
    private int processTime;       // 라우팅 마스터 공정시간 (분)
    private int processSeq;        // 라우팅 스텝 순서
    private LocalDateTime processStart;
    private LocalDateTime processEnd;
    private String remark;
}

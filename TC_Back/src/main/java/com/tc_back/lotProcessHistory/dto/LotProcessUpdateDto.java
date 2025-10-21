package com.tc_back.lotProcessHistory.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LotProcessUpdateDto {
    private LocalDateTime processStart;
    private LocalDateTime processEnd;
    private String remark;
}

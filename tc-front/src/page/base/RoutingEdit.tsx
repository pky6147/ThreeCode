import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';

import type { AxiosError } from 'axios';
import { updateRoutings } from '../../api/routingApi';

interface RoutingEditProps {
  doClose: () => void;
  data: {
    routingMasterId: number;
    processCode: string;
    processName: string;
    processTime: number | string;
    processOrder: number | string;
    remark?: string;
  };
  onUpdated: () => void; // 부모에게 수정 완료 알림
}

export default function RoutingEdit({ doClose, data, onUpdated }: RoutingEditProps) {
  const [form, setForm] = useState({ ...data });

  const handleSave = async () => {
    try {
      await updateRoutings(form.routingMasterId, {
        processCode: form.processCode,
        processName: form.processName,
        processTime: Number(form.processTime),
        processOrder: Number(form.processOrder),
        remark: form.remark,
      });
      alert("수정되었습니다!");
      onUpdated(); // 부모에게 수정 완료 알려서 테이블 갱신
      doClose();
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error(err);
      if (axiosError.response && axiosError.response.data) {
        alert((axiosError.response.data as AxiosError).message || "수정을 실패했습니다.");
      } else {
        alert("수정을 실패했습니다.");
      }
    }
  };

  const handleCancel = () => {
    doClose();
  };

  return (
    <Box sx={{ backgroundColor: 'white', width:'500px', minWidth:'100px', height: '550px' }}>
      <Typography sx={{ color:'black', textAlign: 'center', fontSize: '24px', mt:'20px' }}>
        라우팅 정보 수정
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 5 }}>
        <TextField
          label="공정코드"
          sx={{ width: 400, mb: 2 }}
          value={form.processCode}
          onChange={(e) => setForm({ ...form, processCode: e.target.value })}
        />
        <TextField
          label="공정명"
          sx={{ width: 400, mb: 2 }}
          value={form.processName}
          onChange={(e) => setForm({ ...form, processName: e.target.value })}
        />
        <TextField
          label="공정시간"
          type='number'
          sx={{ width: 400, mb: 2 }}
          value={form.processTime}
          onChange={(e) => setForm({ ...form, processTime: e.target.value })}
        />
        <TextField
          label="공정순서"
          type='number'
          sx={{ width: 400, mb: 2 }}
          value={form.processOrder}
          onChange={(e) => setForm({ ...form, processOrder: e.target.value })}
        />
        <TextField
          label="비고"
          sx={{ width: 400, mb: 2 }}
          value={form.remark}
          onChange={(e) => setForm({ ...form, remark: e.target.value })}
        />
      </Box>
      <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 2 }}>
        <Button variant="contained" color="primary" size="small" onClick={handleSave}>저장</Button>
        <Button variant="outlined" color="secondary" size="small" onClick={handleCancel}>취소</Button>
      </Box>
    </Box>
  );
}

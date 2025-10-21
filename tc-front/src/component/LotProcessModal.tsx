import { useEffect, useState } from 'react';
import { Dialog, Box, Typography, CircularProgress, Table, TableHead, TableRow, TableCell, TableBody, TextField, Button } from '@mui/material';
import dayjs from 'dayjs';
import { getLotProcessHistory, updateLotProcess } from '../api/productInputApi';



interface LotProcessHistoryRow {
  lotProcessHistoryId: number;
  processSeq: number;
  processName: string;
  processCode: string;
  processStart?: string;
  processEnd?: string;
  processTime: number;
  remark?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  productInputId: number | null;
}

export default function LotProcessModal({ open, onClose, productInputId }: Props) {
  const [history, setHistory] = useState<LotProcessHistoryRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && productInputId) {
      fetchHistory();
    }
  }, [open, productInputId]);

 const fetchHistory = async () => {
  setLoading(true);
  try {
    console.log('Fetching history for productInputId:', productInputId);
    const data = await getLotProcessHistory(productInputId!);
    console.log('Fetched history data:', data); // 🔹 데이터 확인용
    setHistory(data);
  } catch (err) {
    console.error(err);
    alert("공정진행현황 조회 실패");
  } finally {
    setLoading(false);
  }
};

  const handleRemarkChange = (id: number, value: string) => {
    setHistory(prev => prev.map(h => h.lotProcessHistoryId === id ? { ...h, remark: value } : h));
  };

 const handleSaveRemark = async (row: LotProcessHistoryRow) => {
  console.log('Saving remark for row:', row); // 🔹 클릭 시 row 확인
  console.log('lotProcessHistoryId:', row.lotProcessHistoryId); // 🔹 ID 확인
  try {
    if (!row.lotProcessHistoryId) {
      alert("ID가 존재하지 않습니다!");
      return;
    }
    await updateLotProcess(row.lotProcessHistoryId, { remark: row.remark });
    alert("저장되었습니다.");
    fetchHistory();
  } catch (err) {
    console.error(err);
    alert("저장 실패");
  }
};

  const handleCompleteProcess = async (row: LotProcessHistoryRow) => {
    try {
      const now = dayjs().format('YYYY-MM-DDTHH:mm:ss');
      await updateLotProcess(row.lotProcessHistoryId, { processEnd: now });
      alert(`공정 "${row.processName}" 완료`);
      fetchHistory(); // 완료 후 갱신 (다음 공정 자동 생성 포함)
    } catch (err) {
      console.error(err);
      alert("공정 완료 처리 실패");
    }
  };

  const getStatus = (row: LotProcessHistoryRow) => {
    if (!row.processStart) return '미시작';
    if (row.processStart && !row.processEnd) return '진행중';
    return '완료';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '미시작': return 'gray';
      case '진행중': return 'orange';
      case '완료': return 'green';
      default: return 'black';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box sx={{ padding: 3 }}>
        <Typography variant="h6" mb={2}>공정 진행 현황</Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>순서</TableCell>
                <TableCell>공정명</TableCell>
                <TableCell>공정코드</TableCell>
                <TableCell>시작일시</TableCell>
                <TableCell>완료일시</TableCell>
                <TableCell>소요시간(분)</TableCell>
                <TableCell>비고</TableCell>
                <TableCell>상태</TableCell>
                <TableCell>액션</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map(row => {
                const status = getStatus(row);
                return (
                  <TableRow key={row.lotProcessHistoryId}>
                    <TableCell>{row.processSeq}</TableCell>
                    <TableCell>{row.processName}</TableCell>
                    <TableCell>{row.processCode}</TableCell>
                    <TableCell>{row.processStart ? dayjs(row.processStart).format('YYYY-MM-DD HH:mm') : '-'}</TableCell>
                    <TableCell>{row.processEnd ? dayjs(row.processEnd).format('YYYY-MM-DD HH:mm') : '-'}</TableCell>
                    <TableCell>{row.processTime}</TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        value={row.remark || ''}
                        onChange={(e) => handleRemarkChange(row.lotProcessHistoryId, e.target.value)}
                        sx={{ width: '100%' }}
                      />
                      <Button size="small" onClick={() => handleSaveRemark(row)}>저장</Button>
                    </TableCell>
                    <TableCell sx={{ color: getStatusColor(status) }}>{status}</TableCell>
                    <TableCell>
                      {status !== '완료' && (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleCompleteProcess(row)}
                        >
                          완료
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </Box>
    </Dialog>
  );
}

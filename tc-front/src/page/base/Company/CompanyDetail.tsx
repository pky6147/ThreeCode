import { Typography, Button, Dialog, Box } from '@mui/material';
import type { CompanyRow } from './Company'; // ✅ 경로 맞추기

interface CompanyDetailProps {
  company: CompanyRow;
  open: boolean;
  onClose: () => void;
}

function CompanyDetail({ company, open, onClose }: CompanyDetailProps) {
  if (!company) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          업체 상세 정보
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Typography><b>업체유형:</b> {company.companyType}</Typography>
          <Typography><b>업체명:</b> {company.companyName}</Typography>
          <Typography><b>대표명:</b> {company.ceoName}</Typography>
          <Typography><b>대표 전화번호:</b> {company.ceoPhone}</Typography>
          <Typography><b>주소:</b> {company.address}</Typography>
          <Typography><b>비고:</b> {company.remark}</Typography>
          <Typography><b>담당자명:</b> {company.contactName}</Typography>
          <Typography><b>담당자 전화번호:</b> {company.contactPhone}</Typography>
          <Typography><b>담당자 이메일:</b> {company.contactEmail}</Typography>
          <Typography><b>사용여부:</b> {company.isActive === 'Y' ? '사용' : '미사용'}</Typography>
        </Box>

        <Box sx={{ textAlign: 'right', marginTop: 3 }}>
          <Button variant="contained" color="secondary" onClick={onClose}>닫기</Button>
        </Box>
      </Box>
    </Dialog>
  );
}

export default CompanyDetail;

import { Dialog, Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Divider, Button } from "@mui/material";

import GuideImg from "../../component/GuideImg";

interface RoutingStepInfo {
  processSeq: number;
  processCode: string;
  processName: string;
  processTime: number;
  remark: string;
}

interface ProductInputInfo {
  productInputId?: number;
  lotNo: string;
  productInputQty: number;
  productInputDate: string;
}

interface WorkGuideData {
  productId: number;
  companyName: string;
  paintType: string;
  productName: string;
  productNo: string;
  category: string;
  color: string;
  price: number;
  remark: string;
  isActive: string;
  imagePaths: string[];
  routingSteps?: RoutingStepInfo[];
  productInputs?: ProductInputInfo[];
}

interface WorkGuideDialogProps {
  open: boolean;
  onClose: () => void;
  data: WorkGuideData | null;
  printRef?: React.RefObject<HTMLDivElement>;
}

export default function WorkGuideDialog({ open, onClose, data, printRef }: WorkGuideDialogProps) {
  if (!data) return null;

const handlePrint = () => {
  if (!printRef?.current) return console.error("printRef is null");

  const printContents = printRef.current.innerHTML;
  const popup = window.open("", "_blank");
  if (popup) {
    popup.document.write(`
      <html>
        <head>
          <title>작업지시서</title>
          <style>
            /* 테이블 스타일 유지 */
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #000; padding: 4px; text-align: center; }
            th { background-color: #f0f0f0; }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    popup.document.close();
    popup.onload = () => popup.print();
  }
};

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box sx={{ p: 3 }}>
        {/* 타이틀 */}
        <Box ref={printRef}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}>
          작업지시서
        </Typography>
        <Divider sx={{ my: 2 }} />

        {/* 기본정보 */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <Typography><b>품목명:</b> {data.productName}</Typography>
          <Typography><b>품목번호:</b> {data.productNo}</Typography>
          <Typography><b>거래처명:</b> {data.companyName}</Typography>
          <Typography><b>도장방식:</b> {data.paintType}</Typography>
          <Typography><b>분류:</b> {data.category}</Typography>
          <Typography><b>색상:</b> {data.color}</Typography>
          <Typography><b>단가:</b> {data.price?.toLocaleString()} 원</Typography>
          <Typography><b>사용여부:</b> {data.isActive}</Typography>
          <Typography sx={{ gridColumn: "1 / span 2" }}>
            <b>비고:</b> {data.remark || "-"}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 이미지 */}
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>이미지</Typography>
        <GuideImg images={data.imagePaths || []} />
        <Divider sx={{ my: 2 }} />

        {/* 라우팅 정보 */}
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>라우팅</Typography>
        {data.routingSteps?.length ? (
          <Table size="small" sx={{ border: "1px solid #ddd" }}>
            <TableHead>
              <TableRow>
                <TableCell align="center">공정순서</TableCell>
                <TableCell align="center">공정코드</TableCell>
                <TableCell align="center">공정명</TableCell>
                <TableCell align="center">공정시간</TableCell>
                <TableCell align="center">비고</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.routingSteps.map((step, idx) => (
                <TableRow key={idx}>
                  <TableCell align="center">{step.processSeq}</TableCell>
                  <TableCell align="center">{step.processCode}</TableCell>
                  <TableCell align="center">{step.processName}</TableCell>
                  <TableCell align="center">{step.processTime}</TableCell>
                  <TableCell align="center">{step.remark}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography color="text.secondary">라우팅 정보 없음</Typography>
        )}

        <Divider sx={{ my: 2 }} />

        {/* 입고 정보 */}
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>입고 정보</Typography>
        {data.productInputs?.length ? (
          <Table size="small" sx={{ border: "1px solid #ddd" }}>
            <TableHead>
              <TableRow>
                <TableCell align="center">LOT번호</TableCell>
                <TableCell align="center">입고수량</TableCell>
                <TableCell align="center">입고일자</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.productInputs.map((input) => (
                <TableRow key={input.productInputId}>
                  <TableCell align="center">{input.lotNo}</TableCell>
                  <TableCell align="center">{input.productInputQty}</TableCell>
                  <TableCell align="center">{input.productInputDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography color="text.secondary">입고 정보 없음</Typography>
        )}
        
      </Box>
      <Button onClick={handlePrint} sx={{ mb: 2 }}>인쇄</Button>
      </Box>
    </Dialog>
  );
}

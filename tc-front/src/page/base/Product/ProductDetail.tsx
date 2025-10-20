import { Dialog, Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Divider } from "@mui/material";
import ProductDetailImages from "../../../component/ProductDetailImages";

interface RoutingStepInfo {
  processName: string;
  processCode: string;
  processSeq: number;
  processTime: number;
  remark: string;
}

interface ProductResponseDto {
  productId: number;
  companyName: string;
  paintType: string;
  productName: string;
  productNo: string;
  category: string;
  price: number;
  color: string;
  remark: string;
  isActive: string;
  imagePaths: string[];
  routingSteps: RoutingStepInfo[];
}

interface ProductDetailProps {
  open: boolean;
  onClose: () => void;
  data: ProductResponseDto | null;
}

export default function ProductDetail({ open, onClose, data }: ProductDetailProps) {
  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}>
          품목 상세정보
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

        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>이미지</Typography>
        {/* 이미지 미리보기 */}
        <ProductDetailImages images={data.imagePaths || []} />
        <Divider sx={{ my: 2 }} />

        {/* 라우팅 스텝 보기 */}
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>라우팅</Typography>
        {data.routingSteps?.length > 0 ? (
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
      </Box>
    </Dialog>
  );
}

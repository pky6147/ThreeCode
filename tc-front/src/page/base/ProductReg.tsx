import { Box, Button, TextField, MenuItem, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { getCompanies, type CompanyDto } from "../../api/CompanyApi";
import RoutingMasterView from "../../component/routingMasterView";
import ImgUpdate, { type ProductImage } from "../../component/ImgUpload";
import { createProduct, type ProductDto } from "../../api/productApi";


interface ProductRegProps {
  doClose: () => void;
}

export default function ProductReg({ doClose }: ProductRegProps) {
  const [companies, setCompanies] = useState<CompanyDto[]>([]);
  const [selectedRoutingIds, setSelectedRoutingIds] = useState<number[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);

  const [data, setData] = useState({
    companyId: 0,
    productName: "",
    productCode: "",
    paintType: "",
    category: "",
    color: "",
    price: 0,
    isActive: "Y",
    remark: "",
  });

  // 거래처 목록 호출
  const fetchCompanies = async () => {
    try {
      const res: CompanyDto[] = await getCompanies();
      setCompanies(res);
    } catch (err) {
      console.error("거래처 조회 실패", err);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: name === "price" || name === "companyId" ? Number(value) : value,
    });
  };

  // 저장
  const handleSave = async () => {
  try {
    const payload: ProductDto = {
      ...data,
      routingIds: selectedRoutingIds,
      images,
    };

    await createProduct(payload);

    alert("등록되었습니다.");
    doClose();
  } catch (err) {
    console.error("등록 실패", err);
    alert("등록 실패했습니다.");
  }
};

  return (
    <Box
      sx={{
        backgroundColor: "white",
        width: "100%",
        minWidth: "0",
        height: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 3,
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          width: "1500px",
          minWidth: "2000px",
          height: "800px",
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography
          sx={{
            color: "black",
            textAlign: "center",
            fontSize: "24px",
            mt: "5px",
          }}
        >
          수주대상품목등록
        </Typography>

        {/* 거래처 + 품목명 + 품목번호 */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            select
            label="거래처명"
            name="companyId"
            value={data.companyId}
            onChange={handleChange}
            size="small"
            sx={{ flex: 1 }}
          >
            <MenuItem value={0}>선택</MenuItem>
            {companies.map((c) => (
              <MenuItem key={c.companyId} value={c.companyId}>
                {c.companyName}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="품목명"
            name="productName"
            value={data.productName}
            onChange={handleChange}
            size="small"
            sx={{ flex: 1 }}
          />
          <TextField
            label="품목번호"
            name="productCode"
            value={data.productCode}
            onChange={handleChange}
            size="small"
            sx={{ flex: 1 }}
          />
        </Box>

        {/* 도장방식 + 분류 + 색상 */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            select
            label="도장방식"
            name="paintType"
            value={data.paintType}
            onChange={handleChange}
            size="small"
            sx={{ flex: 1 }}
          >
            <MenuItem value="">선택</MenuItem>
            <MenuItem value="액체">액체</MenuItem>
            <MenuItem value="분체">분체</MenuItem>
          </TextField>

          <TextField
            select
            label="분류"
            name="category"
            value={data.category}
            onChange={handleChange}
            size="small"
            sx={{ flex: 1 }}
          >
            <MenuItem value="">선택</MenuItem>
            <MenuItem value="방산">방산</MenuItem>
            <MenuItem value="일반">일반</MenuItem>
            <MenuItem value="자동차">자동차</MenuItem>
            <MenuItem value="조선">조선</MenuItem>
          </TextField>

          <TextField
            label="색상"
            name="color"
            value={data.color}
            onChange={handleChange}
            size="small"
            sx={{ flex: 1 }}
          />
        </Box>

        {/* 단가 + 사용여부 */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="단가"
            name="price"
            type="number"
            value={data.price}
            onChange={handleChange}
            size="small"
            sx={{ flex: 1 }}
          />
          <TextField
            label="사용여부"
            name="isActive"
            value={data.isActive}
            size="small"
            disabled
            sx={{ flex: 1 }}
          />
        </Box>

        {/* 비고 */}
        <TextField
          label="비고"
          name="remark"
          multiline
          rows={2}
          value={data.remark}
          onChange={handleChange}
          size="small"
        />

        {/* 라우팅 선택 */}
        <RoutingMasterView
          selectedIds={selectedRoutingIds}
          setSelectedIds={setSelectedRoutingIds}
        />

        {/* 이미지 첨부 */}
        <ImgUpdate images={images} setImages={setImages} />

        {/* 버튼 */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleSave}
          >
            등록
          </Button>
          <Button variant="outlined" color="secondary" size="small" onClick={doClose}>
            취소
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

import { Box, Button, TextField, MenuItem, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getCompanies, type CompanyDto } from "../../../api/CompanyApi";
import RoutingMasterView from "../../../component/routingMasterView";
import ImgUpdate, { type ProductImage } from "../../../component/ImgUpload";
import { createProduct, updateProduct, type ProductDto } from "../../../api/productApi"; // ✅ updateProduct 추가

interface ProductRegProps {
  doClose: () => void;
  initialData?: any; // 수정 시 전달되는 데이터
  isEdit?: boolean;  // 수정 모드 여부
}

export default function ProductReg({ doClose, initialData, isEdit = false }: ProductRegProps) {
  const [companies, setCompanies] = useState<CompanyDto[]>([]);
  const [selectedRoutingIds, setSelectedRoutingIds] = useState<number[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]); // ✅ 기존 이미지 표시용

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

  // ✅ 수정모드: 기존 데이터 세팅
  useEffect(() => {
    if (isEdit && initialData) {
      setData({
        companyId: initialData.companyId ?? 0,
        productName: initialData.productName ?? "",
        productCode: initialData.productNo ?? "", // ✅ 백엔드에선 productNo
        paintType: initialData.paintType ?? "",
        category: initialData.category ?? "",
        color: initialData.color ?? "",
        price: initialData.price ?? 0,
        isActive: initialData.isActive ?? "Y",
        remark: initialData.remark ?? "",
      });

      // 라우팅 스텝 ID 세팅
      if (initialData.routingSteps) {
        setSelectedRoutingIds(initialData.routingSteps.map((s: any) => s.routingMasterId));
      }

      // 이미지 미리보기용 세팅
      setExistingImages(initialData.imagePaths || []);
    }
  }, [isEdit, initialData]);

  // 거래처 목록 호출
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res: CompanyDto[] = await getCompanies();
        setCompanies(res);
      } catch (err) {
        console.error("거래처 조회 실패", err);
      }
    };
    fetchCompanies();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: name === "price" || name === "companyId" ? Number(value) : value,
    });
  };

  // ✅ 저장 (등록 / 수정 구분)
  const handleSave = async () => {
    try {
      const payload: ProductDto = {
        ...data,
        routingIds: selectedRoutingIds.filter(id => id != null),
        images,
      };

      if (isEdit && initialData?.productId) {
        await updateProduct(initialData.productId, payload);
        alert("제품이 수정되었습니다.");
      } else {
        await createProduct(payload);
        alert("제품이 등록되었습니다.");
      }

      doClose();
    } catch (err) {
      console.error("저장 실패", err);
      alert("저장 실패했습니다.");
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
          {isEdit ? "수주대상품목 수정" : "수주대상품목 등록"} {/* ✅ 제목 변경 */}
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
            disabled={isEdit} // ✅ 수정 시 거래처 변경 방지
          >
            <MenuItem value={0}>선택</MenuItem>
            {companies
            .filter((c) => c.companyType === "거래처")
            .map((c) => (
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
            select
            label="활성 여부"
            name="isActive"
            value={data.isActive}
            onChange={handleChange}
            disabled={!isEdit}
            size="small"
            sx={{ flex: 1 }}
          >
            <MenuItem value="Y">사용</MenuItem>
            <MenuItem value="N">미사용</MenuItem>
          </TextField>
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
        <ImgUpdate
          images={images}
          setImages={setImages}
          existingImages={existingImages} // ✅ 기존 이미지 표시
        />

        {/* 버튼 */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleSave}
          >
            {isEdit ? "수정" : "등록"} {/* ✅ 버튼 텍스트 변경 */}
          </Button>
          <Button variant="outlined" color="secondary" size="small" onClick={doClose}>
            취소
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

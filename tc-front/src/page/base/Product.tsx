import { Box, Breadcrumbs, Typography, Card, Dialog } from '@mui/material';
import CustomBtn from '../../component/CustomBtn';
import CommonTable from '../../component/CommonTable';
import type { GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import ProductReg from './ProductReg';
import { getProductDetail, getProducts } from '../../api/productApi'; // ✅ 추가
import ProductDetail from './ProductDetail';

function Company() {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<any[]>([]); // ✅ 서버에서 받아올 데이터
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleDetail = async (productId: number) => {
    try {
      const res = await getProductDetail(productId);
      console.log("상세조회 응답:", res);
      setSelectedProduct(res);
      setDetailOpen(true);
    } catch (err) {
      console.error("상세조회 실패:", err);
    }
  };

  // ✅ 페이지 로드시 제품 목록 조회
  useEffect(() => {
    getProducts()
      .then((data) => {
        // 백엔드 DTO(ProductListDto) -> 테이블 구조에 맞게 변환
        const mapped = data.map((item: any, idx: number) => ({
          id: item.productId,
          idx: idx + 1,
          company_name: item.companyName,
          product_no: item.productNo,
          product_name: item.productName,
          category: item.category,
          paint_type: item.paintType,
          price: item.price,
          remark: item.remark,
          is_active: item.isActive,
        }));
        setRows(mapped);
      })
      .catch((err) => console.error("제품 목록 조회 실패:", err));
  }, []);
  

  const columns: GridColDef[] = [
    { field: 'idx', headerName: 'No', width: 70, headerAlign: 'center', align: 'center' },
    { field: 'company_name', headerName: '거래처명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
    { field: 'product_no', headerName: '품목번호', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
    { field: 'product_name', headerName: '품목명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center',
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            cursor: 'pointer', textDecoration: 'underline', color: 'blue',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '100%', width: '100%'
          }}
          onClick={() => handleDetail(params.row.id)}
        >
          {params.value}
        </Typography>
      ),
    },
    { field: 'category', headerName: '분류', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
    { field: 'paint_type', headerName: '도장방식', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
    {
      field: 'price', headerName: '단가', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'right',
      renderCell: (params) => params.value?.toLocaleString(),
    },
    { field: 'remark', headerName: '비고', flex: 3, minWidth: 300, headerAlign: 'center', align: 'left' },
    { field: 'is_active', headerName: '사용여부', width: 100, headerAlign: 'center', align: 'center' },
    {
      field: 'edit', headerName: '수정', width: 100, headerAlign: 'center', align: 'center',
      renderCell: (params) => (
        <CustomBtn
          width="50px"
          text="수정"
          onClick={() => alert(`수정할 ID: ${params.row.id}`)}
        />
      ),
    },
    {
      field: 'del', headerName: '삭제', width: 100, headerAlign: 'center', align: 'center',
      renderCell: (params) => (
        <CustomBtn
          width="50px"
          text="삭제"
          backgroundColor='#fb1e1eff'
          onClick={() => alert(`삭제할 ID: ${params.row.id}`)}
        />
      ),
    },
  ];

  const handleRegist = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleRegistFinish = () => {
    setOpen(false);
    // 등록 후 새로고침
    getProducts().then((data) => {
      const mapped = data.map((item: any, idx: number) => ({
        id: item.productId,
        idx: idx + 1,
        company_name: item.companyName,
        product_no: item.productNo,
        product_name: item.productName,
        category: item.category,
        paint_type: item.paintType,
        price: item.price,
        remark: item.remark,
        is_active: item.isActive,
      }));
      setRows(mapped);
    });
  };
  



  return (
    <Card sx={{ height: '98%', margin: '0.5%' }}>
      <Box>
        {/* Breadcrumbs 영역 */}
        <Breadcrumbs sx={{ padding: 2 }}>
          <Typography sx={{ color: 'text.primary' }}>기준정보 관리</Typography>
          <Typography sx={{ color: 'text.primary', fontWeight: 'bold' }}>수주품목 관리</Typography>
        </Breadcrumbs>

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '24px', fontWeight: 'bold', paddingLeft: 2 }}>수주품목 정보</Typography>
            <Box sx={{ paddingRight: 2 }}>
              <CustomBtn text="등록" backgroundColor="green" onClick={handleRegist} />
            </Box>
          </Box>

          <Box sx={{ padding: 2 }}>
            <CommonTable columns={columns} rows={rows} />
          </Box>
        </Box>
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth={false}>
        <ProductReg doClose={handleRegistFinish} />
      </Dialog>

      <ProductDetail
      open={detailOpen}
      onClose={() => setDetailOpen(false)}
      data={selectedProduct}
    />
    </Card>
  );
}

export default Company;

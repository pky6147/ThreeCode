import { useEffect, useState } from 'react';
import { Box, Typography, Card, Dialog, type SelectChangeEvent } from '@mui/material';
import CustomBC from '../../../component/CustomBC';
import CustomBtn from '../../../component/CustomBtn';
import CommonTable from '../../../component/CommonTable';
import type { GridColDef } from '@mui/x-data-grid';
import { deleteProduct, getProductDetail, getProducts } from '../../../api/productApi'; // ✅ 추가
import ProductReg from './ProductReg';
import ProductDetail from './ProductDetail';
import LabelInput from '../../../component/LabelInput';
import LabelSelect from '../../../component/LabelSelect'
import SearchBar from '../../../component/SearchBar';
import ExcelBtn from '../../../component/ExcelBtn';
import AlertPopup, { type AlertProps}  from '../../../component/AlertPopup';

interface RowData {
    id?: number;
    idx?: number;
    productId?: number;
    companyId?: number;
    companyName?: string;
    productNo?: string;
    productName?: string;
    category?: string;
    color?: string;
    paintType?: string;
    price?: string;
    remark?: string;
    isActive?: string;
}

function Company() {
  const [rows, setRows] = useState<RowData[]>([]); // ✅ 서버에서 받아올 데이터
  /* Dialog open */
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  /* Search */
  const [searchInfo, setSearchInfo] = useState({
          companyName: '',
          productNo: '',
          productName: '',
          isActive: 'Y',
      })
  const [listActiveYN] = useState<{id: string; name:string}[]>([
          {id: 'Y', name: 'Y'},
          {id: 'N', name: 'N'},
  ])
  const [searchRows, setSearchRows] = useState<RowData[]>([])
  const [isSearch, setIsSearch] = useState(false)
  /* Alert */
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertInfo, setAlertInfo] = useState<AlertProps>({})

  const getProductData = async () => {
    try {
        const data = await getProducts();
        
        const result = data.map((row: RowData, index: number) => ({
            ...row,
            id: row.productId,
            idx: index+1,
        }))
        setRows(result)
    }
    catch(err) {
        console.error(err)
        alert("조회 실패!")
    }
  }
  // ✅ 페이지 로드시 제품 목록 조회
  useEffect(() => {
    getProductData();
    // getProducts()
    //   .then((data) => {
    //     // 백엔드 DTO(ProductListDto) -> 테이블 구조에 맞게 변환
    //     const mapped = data.map((item: RowData, idx: number) => ({
    //       id: item.productId,
    //       idx: idx + 1,
    //       company_name: item.companyName,
    //       product_no: item.productNo,
    //       product_name: item.productName,
    //       category: item.category,
    //       paint_type: item.paintType,
    //       price: item.price,
    //       remark: item.remark,
    //       is_active: item.isActive,
    //     }));
    //     setRows(mapped);
    //   })
    //   .catch((err) => console.error("제품 목록 조회 실패:", err));
  }, []);

  const BoardRefresh = () => {
        getProductData();
    }
  const handleRegist = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleRegistFinish = () => {
    setOpen(false);
    // 등록 후 새로고침
    BoardRefresh();
    // getProducts().then((data) => {
    //   const mapped = data.map((item: rowData, idx: number) => ({
    //     id: item.productId,
    //     idx: idx + 1,
    //     company_name: item.companyName,
    //     product_no: item.productNo,
    //     product_name: item.productName,
    //     category: item.category,
    //     paint_type: item.paintType,
    //     price: item.price,
    //     remark: item.remark,
    //     is_active: item.isActive,
    //   }));
    //   setRows(mapped);
    // });
  };

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

  const handleEdit = async (productId: number) => {
    try {
      const res = await getProductDetail(productId); // ✅ 상세조회 API 재활용
      setEditData(res);
      setEditOpen(true);
    } catch (err) {
      console.error("수정 데이터 불러오기 실패:", err);
    }
  };

  // 검색/초기화
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const selectedId = event.target.value;
    const selectedActive = listActiveYN.find(c => c.id === selectedId)
    if(selectedActive) {
        setSearchInfo(prev => ({
            ...prev,
            isActive: selectedActive.name,
        }))
    }
  }
  const handleSearch = () => {
    setIsSearch(true)
    const filtered = rows.filter(row =>
        (row.companyName?.toLowerCase() || '').includes(searchInfo.companyName.toLowerCase()) &&
        (row.productNo?.toLowerCase() || '').includes(searchInfo.productNo.toLowerCase()) &&
        (row.productName?.toLowerCase() || '').includes(searchInfo.productName.toLowerCase()) &&
        (row.isActive?.toLowerCase() || '').includes(searchInfo.isActive.toLowerCase()) 
    )
    setSearchRows(filtered)
  }
  const handleReset = () => {
    setIsSearch(false)
    setSearchInfo({
        companyName: '',
        productNo: '',
        productName: '',
        isActive: 'Y'
    })
    setSearchRows(rows)
  }
  const handleSearchChange = (key: keyof typeof searchInfo, value: string) => {
    setSearchInfo((prev) => ({ ...prev, [key]: value }));
  };

  /* Alert 팝업 */
  const handleCloseAlert = () => {
      setAlertOpen(false)
  }
  const handleAlertSuccess = () => {
      setAlertInfo({
          type: 'success',
          title: '삭제',
          text: '데이터 삭제 성공'
      })
      setAlertOpen(true)
      setTimeout(() => setAlertOpen(false), 2000)
  }
  const handleAlertFail = () => {
      setAlertInfo({
          type: 'error',
          title: '데이터 삭제',
          text: '데이터 삭제 실패'
      })
      setAlertOpen(true)
      setTimeout(()=> setAlertOpen(false), 3000)
  }

  /* ExcelBtn Props */
  interface ExcelData {
      idx: number;
      companyName: string;
      productName: string;
      productNo: string;
      category: string;
      paintType: string;
      price: number;
      remark: string;
      isActive: string;
  }
  // 엑셀 컬럼 헤더 매핑 정의
  const headerMap: Record<keyof ExcelData, string> = {
      idx: 'Seq',
      companyName: '기업명',
      productName: '품목명',
      productNo: '품목번호',
      category: '분류',
      paintType: '도장방식',
      price: '단가',
      remark: '비고',
      isActive: '사용여부'
  }
  const excelData = rows.map(row =>
      (Object.keys(headerMap) as (keyof ExcelData)[]).reduce<Record<string, string>> (
          (acc, key) => {
              const value = row[key];
              acc[headerMap[key]] = value != null ? String(value) : '';
              return acc;
          },
          {}
      )
  );

  const columns: GridColDef[] = [
    { field: 'idx', headerName: 'No', width: 70, headerAlign: 'center', align: 'center' },
    { field: 'companyName', headerName: '거래처명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
    { field: 'productNo', headerName: '품목번호', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
    { field: 'productName', headerName: '품목명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center',
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
    { field: 'paintType', headerName: '도장방식', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
    {
      field: 'price', headerName: '단가', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'right',
      renderCell: (params) => params.value?.toLocaleString(),
    },
    { field: 'remark', headerName: '비고', flex: 3, minWidth: 300, headerAlign: 'center', align: 'left' },
    { field: 'isActive', headerName: '사용여부', width: 100, headerAlign: 'center', align: 'center' },
    {
      field: 'edit', headerName: '수정', width: 100, headerAlign: 'center', align: 'center',
      renderCell: (params) => (
        <CustomBtn
          width="50px"
          text="수정"
          icon="edit"
          onClick={() => handleEdit(params.row.id)}
        />
      ),
    },
    {
  field: 'del', headerName: '삭제', width: 100, headerAlign: 'center', align: 'center',
  renderCell: (params) => (
    <CustomBtn
      width="50px"
      text="삭제"
      icon="delete"
      backgroundColor='#fb1e1eff'
      onClick={async () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
          try {
            await deleteProduct(params.row.id);
            // alert("삭제되었습니다.");
            handleAlertSuccess()
            // 삭제 후 목록 갱신
            BoardRefresh()
            // const data = await getProducts();
            // const mapped = data.map((item: any, idx: number) => ({
            //   id: item.productId,
            //   idx: idx + 1,
            //   company_name: item.companyName,
            //   product_no: item.productNo,
            //   product_name: item.productName,
            //   category: item.category,
            //   paint_type: item.paintType,
            //   price: item.price,
            //   remark: item.remark,
            //   is_active: item.isActive,
            // }));
            // setRows(mapped);
          } catch (err) {
            console.error(err);
            handleAlertFail()
            // alert("삭제 실패했습니다.");
          }
        }
      }}
    />
  ),
}
  ];

  return (
    <Card sx={{ height: '98%', margin: '0.5%' }}>
      <Box>
        {/* Breadcrumbs 영역 */}
        <CustomBC text="수주품목 관리" subText='기준정보 관리' />
        <Box sx={{padding: 2}}>
          <SearchBar onSearch={handleSearch} onReset={handleReset}>
            <LabelInput 
                labelText='매입처명'
                value={searchInfo.companyName}
                onChange={(e) => handleSearchChange('companyName', e.target.value)}
            />
            <LabelInput 
                labelText='품목번호'
                value={searchInfo.productNo}
                onChange={(e) => handleSearchChange('productNo', e.target.value)}
            />
            <LabelInput 
                labelText='품목명'
                value={searchInfo.productName}
                onChange={(e) => handleSearchChange('productName', e.target.value)}
            />
            <LabelSelect 
                labelText='사용여부'
                value={searchInfo.isActive?.toString() || ''}
                onChange={handleSelectChange}
                options={listActiveYN}
            />
          </SearchBar>
        </Box>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '24px', fontWeight: 'bold', paddingLeft: 2 }}>수주품목 정보</Typography>
            <Box sx={{ display:'flex', paddingRight: 2, gap: 2 }}>
              <ExcelBtn mappingdata={excelData} sheetName="수주대상품목" fileName="수주대상품목" />
              <CustomBtn text="등록" icon="add" backgroundColor="green" onClick={handleRegist} />
            </Box>
          </Box>

          <Box sx={{padding: 2}}>
          { isSearch ? (
              <CommonTable 
              columns={columns}
              rows={searchRows}
              />
          ) : (
              <CommonTable 
                  columns={columns}
                  rows={rows}
              />
          )}
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

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth={false}>
        <ProductReg
          doClose={() => {
            setEditOpen(false);
            // 수정 후 목록 갱신
            BoardRefresh()
            // getProducts().then((data) => {
            //   const mapped = data.map((item: any, idx: number) => ({
            //     id: item.productId,
            //     idx: idx + 1,
            //     company_name: item.companyName,
            //     product_no: item.productNo,
            //     product_name: item.productName,
            //     category: item.category,
            //     paint_type: item.paintType,
            //     price: item.price,
            //     remark: item.remark,
            //     is_active: item.isActive,
            //   }));
            //   setRows(mapped);
            // });
          }}
          initialData={editData}
          isEdit={true}
        />
      </Dialog>
      {/* 팝업창 */}
      <Dialog open={alertOpen} onClose={handleCloseAlert}>
        <AlertPopup 
            type={alertInfo.type} 
            title={alertInfo.title} 
            text={alertInfo.text} 
        />
      </Dialog>
    </Card>
  );
}

export default Company;

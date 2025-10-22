import { useState, useEffect } from 'react'
import { Box, Typography, Card, TextField } from '@mui/material'
import CustomBC from '../../component/CustomBC';
import CustomBtn from '../../component/CustomBtn';
import CommonTable from '../../component/CommonTable';
import type { GridColDef } from '@mui/x-data-grid'
import ExcelBtn from '../../component/ExcelBtn';
import LabelInput from '../../component/LabelInput';
import LabelDatepicker from '../../component/LabelDatepicker';
import SearchBar from '../../component/SearchBar';
import dayjs from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { AxiosError } from 'axios';
import { productOutputApi } from '../../api/ProductOutputApi';
import OutputMemo from './OutputMemo';

export interface OutputData {
  id?: number;
  productOutputId: number;
  productInputId: number;
  productOutputNo: string;
  productOutputQty: number;
  productOutputDate: string;
  remark?: string;
  lotNo: string;
  companyName: string;
  productNo: string;
  productName: string;
  category: string;
  paintType: string;
  productInputQty: number;
  productInputDate: string;
  isEditing?: boolean;
}


function OutputState() {
  const [rows, setRows] = useState<OutputData[]>([]);
  const [temp, setTemp] = useState<OutputData>(rows[0])
  /* Search */
  const [searchInfo, setSearchInfo] = useState({
          companyName: '',
          productNo: '',
          productName: '',
          productOutputNo: '',
          productOutputDate: '',
      })
  const [searchRows, setSearchRows] = useState<OutputData[]>([])
  const [isSearch, setIsSearch] = useState(false)
  /* 출하증 모달 */
  const [modalRow, setModalRow] = useState<OutputData | null>(null);
  
  

  // 출고 데이터 가져오기 
  const getProductOutputData = async () => {
    try {
      const res = await productOutputApi.getAll();
      
      const mapped = res.map((item: OutputData) => ({
        ...item,
        id: item.productOutputId
      }))
      
      setRows(mapped)
    } catch (err) {
      console.error(err);
      alert('출고 목록을 불러오는 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    getProductOutputData();
  }, []);

  // const BoardRefresh = () => {
  //     getProductOutputData();
  // }
  

  // 출하증 모달
  const handleOpenDeliveryNote = (row: OutputData) => {setModalRow(row);};
  // 모달 닫기
  const handleCloseModal = () => setModalRow(null);

  /* 검색/초기화 관련함수 */
  const handleSearch = () => {
      setIsSearch(true)
      const filtered = rows.filter(row =>
          (row.companyName?.toLowerCase() || '').includes(searchInfo.companyName.toLowerCase()) &&
          (row.productNo?.toLowerCase() || '').includes(searchInfo.productNo.toLowerCase()) &&
          (row.productName?.toLowerCase() || '').includes(searchInfo.productName.toLowerCase()) &&
          (row.productOutputNo?.toLowerCase() || '').includes(searchInfo.productOutputNo.toLowerCase()) &&
          (row.productOutputDate?.toLowerCase() || '').includes(searchInfo.productOutputDate.toLowerCase()) 
      )
      setSearchRows(filtered)
  }
  const handleReset = () => {
      setIsSearch(false)
      setSearchInfo({
          companyName: '',
          productNo: '',
          productName: '',
          productOutputNo: '',
          productOutputDate: ''
      })
      setSearchRows(rows)
  }
  const handleSearchChange = (key: keyof typeof searchInfo, value: string) => {
      setSearchInfo((prev) => ({ ...prev, [key]: value }));
  };

  /* ExcelBtn Props */
  interface ExcelData {
      productOutputNo: string;
      companyName: string;
      productNo: string;
      productName: string;
      category: string;
      paintType: string;
      productOutputQty: number;
      productOutputDate: string;
  }
  // 엑셀 컬럼 헤더 매핑 정의
  const headerMap: Record<keyof ExcelData, string> = {
      productOutputNo: '출고번호',
      companyName: '거래처명',
      productNo: '품목번호',
      productName: '품목명',
      category: '분류',
      paintType: '도장방식',
      productOutputQty: '출고수량',
      productOutputDate: '출고일자',
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

  // 테이블 내 값 변경
  const handleChange = <K extends keyof OutputData> (
      id: number,
      field: K,
      value: OutputData[K]
  ) => {
      setRows((prev) => 
          prev.map((row) =>
              row.id === id ? { ...row, [field]: value } : row
          )
      )
  }
  // 수정버튼 클릭
  const handleEdit = (row: OutputData, edit: boolean) => {
      setTemp(row)
      setRows(prev => prev.map(r => r.id === row.id ? { ...r, isEditing: edit } : r));
  }
  // 저장 버튼 클릭
  const handleSave = async (row: OutputData) => {
  try {
      if (!row.id) return;

      await productOutputApi.update(row.id, {
          productOutputQty: row.productOutputQty,
          productOutputDate: row.productOutputDate,
          remark: row.remark,
      });

      // 수정 완료 후 테이블 갱신
      setRows(prev =>
        prev.map(r => r.id === row.id ? { ...r, isEditing: false } : r)
      );

  } catch(err) {
      console.error(err);
      alert('출고 수정 중 오류가 발생했습니다.');
  }
};

  // 취소 버튼 클릭
  const handleCancel = (row: OutputData) => {
    setRows(prev =>
      prev.map(r =>
        r.id === row.id
          ? { ...r, 
              isEditing: false, 
              ['productOutputQty']: temp.productOutputQty,
              ['productOutputDate']: temp.productOutputDate,
          }
          : r
      )
    );
  }
  // 삭제 버튼 클릭
  const handleDelete = async (id: number) => {
  if (!confirm("정말 삭제하시겠습니까?")) return;
  try {
      await productOutputApi.remove(id);
      setRows(prev => prev.filter(r => r.id !== id));
  } catch(err) {
      console.error(err);
      alert('출고 삭제 중 오류가 발생했습니다.');
  }
}

  const columns: GridColDef[] = [
    { field: 'productOutputNo', headerName: '출고번호', width: 180, headerAlign: 'center', align: 'center' },
    { field: 'companyName', headerName: '거래처명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
    { field: 'productNo', headerName: '품목번호', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
    { field: 'productName', headerName: '품목명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
    { field: 'category', headerName: '분류', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
    { field: 'paintType', headerName: '도장방식', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
    { field: 'productOutputQty', headerName: '출고수량', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'right',
      renderCell: (params) => {
        if(params.row.isEditing) {
            return (
                <TextField
                    type="text"
                    size="small"
                    value={params.row.productOutputQty?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || ''}
                    onChange={(e) => {
                        // 입력값에서 콤마 제거 후 숫자로 변환
                        const rawValue = e.target.value.replace(/,/g, '');
                        handleChange(params.row.id, 'productOutputQty', Number(rawValue))
                    }}
                    sx={{ width: '100%', paddingTop: 0.7, display: 'flex' }}
                    InputProps={{ sx: { '& input': { textAlign: 'right' } } }}
                />
            )
        } else {
            return params.value?.toLocaleString();
        }
      }
    },
    { field: 'productOutputDate', headerName: '출고일자', flex: 2, minWidth: 200, headerAlign: 'center', align: 'center',
      renderCell: (params) => {
        if(params.row.isEditing) {
            return (
                <DatePicker
                  format="YYYY-MM-DD"
                  value={params.row.productOutputDate ? dayjs(params.row.productOutputDate) : null}
                  onChange={(newValue) =>
                    handleChange(
                      params.row.id,
                      'productOutputDate',
                      newValue?.format('YYYY-MM-DD') || ''
                    )
                  }
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: { width: '100%', paddingTop: 0.7 },
                    },
                  }}
                />
            )
        } else {
            if (!params.value) return ''; // 값 없으면 빈 문자열
            return dayjs(params.value).format('YY.MM.DD'); 
        }
      }
    },
    { field: 'edit', headerName: '수정', width: 150, headerAlign: 'center', align: 'center',
      renderCell: (params) => {
        if(params.row.isEditing) {
          return (
            <Box sx={{display: 'flex', gap: 0.5, justifyContent: 'center', paddingTop: 1.3}}>
              <CustomBtn
                  backgroundColor='green'
                  text="저장"
                  icon="check"
                  onClick={() => handleSave(params.row)}
              />
              <CustomBtn
                  backgroundColor='red'
                  text="취소"
                  icon="close"
                  onClick={() => handleCancel(params.row)}
              />
            </Box>
          );
        } else {
          return (
            <CustomBtn
                width="50px"
                text="수정"
                icon="edit"
                onClick={() => handleEdit(params.row, true)}
            />
          )
        }
      }
    },
    { field: 'del', headerName: '삭제', width: 90, headerAlign: 'center', align: 'center',
        renderCell: (params) => {
            return (
                <CustomBtn
                    width="50px"
                    text="삭제"
                    icon="delete"
                    backgroundColor='red'
                    onClick={() => handleDelete(params.row.productInputId)}
                />
            )
        }
    },
    {
      field: 'delivery_note',
      headerName: '출하증',
      width: 100,
      headerAlign: 'center', align: 'center',
      renderCell: (params) => (
        <CustomBtn text="" color="black" icon="print" onClick={() => handleOpenDeliveryNote(params.row)} />
      ),
    },
  ];

return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ height: '98%', margin: '0.5%'}}>
        <Box>
          {/* BreadCrumbs */}
          <CustomBC text="출고 현황" subText='수주대상 입출고 관리' />
          {/* Search */}
          <Box sx={{padding: 2}}>
            <SearchBar onSearch={handleSearch} onReset={handleReset}>
              <LabelInput 
                  labelText='거래처명'
                  value={searchInfo.companyName}
                  fontSize={22}
                  onChange={(e) => handleSearchChange('companyName', e.target.value)}
              />
              <LabelInput 
                  labelText='품목번호'
                  value={searchInfo.productNo}
                  fontSize={22}
                  onChange={(e) => handleSearchChange('productNo', e.target.value)}
              />
              <LabelInput 
                  labelText='품목명'
                  value={searchInfo.productName}
                  fontSize={22}
                  onChange={(e) => handleSearchChange('productName', e.target.value)}
              />
              <LabelInput 
                  labelText='출고번호'
                  value={searchInfo.productOutputNo}
                  fontSize={22}
                  onChange={(e) => handleSearchChange('productOutputNo', e.target.value)}
              />
              <LabelDatepicker 
                  labelText='출고일자'
                  value={searchInfo.productOutputDate}
                  fontSize={22}
                  onChange={(date) => handleSearchChange('productOutputDate', date ? date.format('YYYY-MM-DD') : '')}
              />
            </SearchBar>
          </Box>
          {/* Content */}
          <Box>
            {/* title & button */}
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <Typography sx={{ fontSize: '24px', fontWeight: 'bold', paddingLeft: 2 }}>수주대상품목 출고 현황</Typography>
              <Box sx={{paddingRight: 2}}>
                <ExcelBtn mappingdata={excelData} sheetName="수주대상품목 출고 현황" fileName="수주대상품목 출고 현황" />
              </Box>
            </Box>
            {/* table */}
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
      </Card>

      {/* 출하증 모달 */}
    {modalRow && (
      <OutputMemo rowData={modalRow} handleClose={handleCloseModal} />
    )}
    </LocalizationProvider>
  )
}

export default OutputState;
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import CustomBtn from '../component/CustomBtn';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

interface ExcelProps {
    mappingdata: Record<string, string>[];
    sheetName?: string;
    fileName?: string; 
}

export default function ExcelBtn(
    {   mappingdata,
        sheetName = "Sheet1", 
        fileName = "MES_Excel_Data" 
    }: ExcelProps) {
    
    /* Excel download */
    const handleExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(mappingdata);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        
        const excelBuffer = XLSX.write(workbook, {bookType: "xlsx", type: "array"});
        const blob = new Blob([excelBuffer], { type: "application/octet-stream"});
        
        saveAs(blob, `${fileName}_${new Date().toISOString().slice(0,10)}.xlsx`);
    }

    return (
        <CustomBtn 
            text="엑셀"
            backgroundColor='green'
            onClick={handleExcel}
            startIcon={<FileDownloadIcon/>}
        />
    )
}

// interface ExcelData {
//     idx: number;
//     companyName: string;
//     materialName: string;
//     materialNo: string;
//     spec: string;
//     maker: string;
//     remark: string;
//     isActive: string;
// }
// // 엑셀 컬럼 헤더 매핑 정의
// const headerMap: Record<keyof ExcelData, string> = {
//     idx: 'Seq',
//     companyName: '기업명',
//     materialName: '품목명',
//     materialNo: '품목번호',
//     spec: '규격',
//     maker: '제조사',
//     remark: '비고',
//     isActive: '사용여부'
// }
// const mappedRows = rows.map(row => 
//     Object.entries(headerMap).reduce<Record<string,string>>(
//         (acc, [key, header]) => { 
//             const value = row[key as keyof ExcelData];
//             acc[header] = value !== undefined ? String(value) : '';
//             return acc;
//         },
//         {}
//     )
// );
// 1. 시트 데이터 만들기
// const worksheet = XLSX.utils.json_to_sheet(mappedRows);
// 2. 엑셀 통합 문서(workbook) 만들기
// const workbook = XLSX.utils.book_new();
// XLSX.utils.book_append_sheet(workbook, worksheet, "원자재 품목");
// 3. 바이너리 형태로 엑셀파일 생성
// const excelBuffer = XLSX.write(workbook, {bookType: "xlsx", type: "array"});
// const blob = new Blob([excelBuffer], { type: "application/octet-stream"});
// 4. 파일 다운로드
// saveAs(blob, `원자재품목${new Date().toISOString().slice(0,10)}.xlsx`);
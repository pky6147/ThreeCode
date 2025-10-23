import { Box, Checkbox, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import { getRoutings } from "../api/routingApi";

export interface RoutingMasterDto {
  routingMasterId: number;
  processName: string;
  processCode: string;
  processTime: number;
  processOrder:number;
  remark: string;
}
interface RoutingMasterViewProps {
  selectedIds: number[]; // 부모에서 선택된 ID 전달 가능
  setSelectedIds: (ids: number[]) => void; // 선택 상태를 부모에 전달
}

export default function RoutingMasterView({ selectedIds, setSelectedIds }: RoutingMasterViewProps) {
  const [routings, setRoutings] = useState<RoutingMasterDto[]>([]);

  const fetchRoutings = async () => {
    try {
      const res: RoutingMasterDto[] = await getRoutings();

      const sortedResult = res.sort((a, b) => {
        // 예: "LC-100" → ["LC", "100"]
        const [prefixA, numA] = a.processCode.split('-');
        const [prefixB, numB] = b.processCode.split('-');
        // 1️⃣ 접두사 문자열 비교
        const prefixCompare = prefixA.localeCompare(prefixB);
        if (prefixCompare !== 0) return prefixCompare;
        // 2️⃣ 숫자 부분 비교 (문자열이지만 숫자로 변환)
        const numberCompare = Number(numA) - Number(numB);
        if (numberCompare !== 0) return numberCompare;
        // 3️⃣ processOrder 기준 정렬 (숫자)
        return a.processOrder - b.processOrder;
      }).map((row) => ({
          ...row,
          id: row.routingMasterId
      }))
      
      setRoutings(sortedResult);

      setRoutings(res);
    } catch (err) {
      console.error("라우팅 조회 실패", err);
    }
  };

  useEffect(() => {
    fetchRoutings();
  }, []);

  const handleCheck = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    }
  };

  return (
    <Box  sx={{ maxHeight: 300, overflow: "auto", border: "1px solid #ddd" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>선택</TableCell>
            <TableCell>공정코드</TableCell>
            <TableCell>공정명</TableCell>
            <TableCell>공정순서</TableCell>
            <TableCell>공정시간</TableCell>
            <TableCell>비고</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {routings.map((r) => (
            <TableRow key={r.routingMasterId}>
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(r.routingMasterId)}
                  onChange={(e) => handleCheck(r.routingMasterId, e.target.checked)}
                />
              </TableCell>
              <TableCell>{r.processCode}</TableCell>
              <TableCell>{r.processName}</TableCell>
              <TableCell>{r.processOrder}</TableCell>
              <TableCell>{r.processTime}</TableCell>
              <TableCell>{r.remark}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
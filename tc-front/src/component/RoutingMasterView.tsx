import { Box, Checkbox, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import { getRoutings } from "../api/routingApi";

export interface RoutingMasterDto {
  routingMasterId: number;
  processName: string;
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
              <TableCell sx={{ color: "black" }}>{r.processName}</TableCell>
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
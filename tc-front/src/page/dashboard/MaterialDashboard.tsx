import { useState, useEffect} from 'react'
import { Box, Card, Typography,  } from '@mui/material'
import CommonTable from '../../component/CommonTable'
import type { GridColDef } from '@mui/x-data-grid'
import { getMaterialInput } from '../../api/materialInputApi'
import {type MaterialInputType} from '../material/InputState'
import { getMaterialOutput } from '../../api/materialOutputApi'
import {type MaterialOutputType} from '../material/OutputState'
import { getMaterialStock } from '../../api/materialStock'
import {type MaterialStockType} from '../material/Stock'
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, LabelList, type PieLabelRenderProps 
} from 'recharts';

interface MaterialSum {
  materialId: number;
  materialName: string;
  totalQty: number;
}

interface MaterialTransactionType {
  materialId: number;
  materialNo: string;
  materialName: string;
  createdAt: string;
  materialQty: number;       // ✅ 입출고 수량 통일
  materialDate: string;      // ✅ 입출고 일자 통일
  type: '입고' | '출고';      // ✅ 구분 필드
  materialNumber: string;
}

interface MaterialBarChartType {
    materialId: number;
    materialName: string;
    inputQty: number;   // 이번 달 입고 총합
    outputQty: number;  // 이번 달 출고 총합
}

interface MaterialPieChartType {
    name: string;
    value: number;
    fill: string;
    [key: string]: string | number;
}

const formatNumber = (value: number | string): string => {
  const num = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(num)) return '0';
  return new Intl.NumberFormat('ko-KR').format(num);
};
const formatLabel = (label: React.ReactNode): string => {
  if (typeof label === 'number' || typeof label === 'string') {
    const num = Number(label);
    if (Number.isNaN(num)) return '0';
    return new Intl.NumberFormat('ko-KR').format(num);
  }
  return '0'; // ⚡️ 빈 문자열 대신 '0'이나 기본값을 반환
};

const COLORS = [
  '#4e79a7', // 파랑
  '#f28e2b', // 주황
  '#e15759', // 빨강
  '#76b7b2', // 민트
  '#59a14f', // 초록
  '#edc949', // 노랑
  '#af7aa1', // 보라
  '#ff9da7', // 연핑크
  '#9c755f', // 갈색
  '#bab0ab', // 회색
];
let colorIndex = 0;
const shuffledColors = COLORS.sort(() => Math.random() - 0.5);

export default function MaterialDashboard() {
    const [mIOdata, setMIOdata] = useState<MaterialTransactionType[]>([])
    const [mBarchartData, setMBarchartData] = useState<MaterialBarChartType[]>([])
    const [stockData, setStockData] = useState<MaterialPieChartType[]>([])
    const [tableData, setTableData] = useState<MaterialStockType[]>([])

    useEffect(() => {
        const getMaterialIOData = async () => {
        try {
            const today = new Date().toISOString().slice(0, 10);

            const MIdata: MaterialInputType[] = await getMaterialInput();
            const MOdata: MaterialOutputType[] = await getMaterialOutput();
            const Sdata = await getMaterialStock();

            const base = Sdata.map((row: MaterialStockType, index: number) => ({
                ...row,
                id: index,
                idx: index+1,
            }))
            setTableData(base)

            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth(); // 0부터 시작 (1월=0)

            // 1️⃣ 이번 달 입고 합산
            const monthlySumsInput: MaterialSum[] = Object.values(
              MIdata.filter(
                (item) =>
                  item.materialInputDate &&
                  new Date(item.materialInputDate).getFullYear() === currentYear &&
                  new Date(item.materialInputDate).getMonth() === currentMonth
              ).reduce<Record<number, MaterialSum>>((acc, cur) => {
                if (!acc[cur.materialId]) {
                  acc[cur.materialId] = {
                    materialId: cur.materialId,
                    materialName: cur.materialName,
                    totalQty: cur.materialInputQty,
                  };
                } else {
                  acc[cur.materialId].totalQty += cur.materialInputQty;
                }
                return acc;
              }, {})
            );
            
            // 1️⃣ 이번 달 출고 합산
            const monthlySumsOutput: MaterialSum[] = Object.values(
              MOdata.filter(
                (item) =>
                  item.materialOutputDate &&
                  new Date(item.materialOutputDate).getFullYear() === currentYear &&
                  new Date(item.materialOutputDate).getMonth() === currentMonth
              ).reduce<Record<number, MaterialSum>>((acc, cur) => {
                if (!acc[cur.materialId]) {
                  acc[cur.materialId] = {
                    materialId: cur.materialId,
                    materialName: cur.materialName,
                    totalQty: cur.materialOutputQty,
                  };
                } else {
                  acc[cur.materialId].totalQty += cur.materialOutputQty;
                }
                return acc;
              }, {})
            );

            const chartData: MaterialBarChartType[] = monthlySumsInput.map(input => {
              const output = monthlySumsOutput.find(o => o.materialId === input.materialId);
              return {
                materialId: input.materialId,
                materialName: input.materialName,
                inputQty: input.totalQty,
                outputQty: output ? output.totalQty : 0,
              };
            });
            setMBarchartData(chartData);

            // 금일 원자재 입출고
            const todayInputs: MaterialTransactionType[] = MIdata
            .filter((item:MaterialInputType) => item.materialInputDate?.slice(0,10) === today)
            .map((item: MaterialInputType) => ({
                materialId: item.materialId,
                materialNo: item.materialNo,
                materialName: item.materialName,
                materialQty: item.materialInputQty,
                materialDate: item.materialInputDate,
                createdAt: item.createdAt,
                materialNumber: item.materialInputNo,
                type: '입고', // ✅ 입고 구분 필드 추가
            }));

            const todayOutputs: MaterialTransactionType[] = MOdata
            .filter((item:MaterialOutputType) => item.materialOutputDate?.slice(0,10) === today)
            .map((item: MaterialOutputType) => ({
                materialId: item.materialId,
                materialNo: item.materialNo,
                materialName: item.materialName,
                materialQty: item.materialOutputQty,
                materialDate: item.materialOutputDate,
                createdAt: item.createdAt,
                materialNumber: item.materialOutputNo,
                type: '출고', // ✅ 입고 구분 필드 추가
            }));

            const todayTransactions:MaterialTransactionType[] = [
                ...todayInputs, 
                ...todayOutputs
            ];

            
            todayTransactions.sort((a, b) => 
              new Date(a.createdAt || a.materialDate).getTime() -
              new Date(b.createdAt || b.materialDate).getTime()
            );

            setMIOdata(todayTransactions)

            
            const result: MaterialPieChartType[] = Sdata.map((row: MaterialStockType) => ({
                    name: row.materialName,
                    value: row.count,
                    fill: getRandomColor()
                }))
            setStockData(result)
        } catch(err) {
            console.error(err)
        }
    };
        getMaterialIOData();
    }, [])

    const getRandomColor = () => {
        const color = shuffledColors[colorIndex];
        colorIndex = (colorIndex + 1) % shuffledColors.length; // 순환
        return color;
    }

    const columns: GridColDef[] = [
            { field: 'idx', headerName: 'No', width: 70, headerAlign: 'center', align: 'center' },
            { field: 'companyName', headerName: '매입처명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
            { field: 'materialNo', headerName: '품목번호', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
            { field: 'materialName', headerName: '품목명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
            { field: 'spec', headerName: '규격', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
            { field: 'maker', headerName: '제조사', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
            { field: 'count', headerName: '재고량', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'right',
                renderCell: (params) => {
                    return params.value?.toLocaleString();
                }
            },
        ]

    return (
        <Card sx={{ height: '98%', margin: '0.5%', display: 'flex'}}>
            <Card sx={{width: '50%', padding: 1, gap: 1}}>
                <Card sx={{ padding: 2, backgroundColor: '#ffdf61ff', height: '97%'}}>
                    <Box sx={{height: '50%'}}>
                        <Typography sx={{fontSize: 24, fontWeight: 'bold'}}>금일 원자재 입출고 </Typography>
                        <Box sx={{padding: 1}}>
                            { mIOdata.slice(0, 8).map((item, index) => (
                                <Card key={index} sx={{marginBottom:1 }}>
                                    {item.type === '입고' ? (
                                        <Box sx={{display: 'flex'}}>
                                            <KeyboardDoubleArrowUpIcon sx={{color:'blue'}} />
                                            <Box sx={{ display: 'flex', gap: 3 }}>
                                                <Typography>{ '품목번호: ' + item.materialNo}</Typography>      
                                                <Typography>{ '품목명: ' + item.materialName}</Typography>    
                                                <Typography>{ '입고일자: ' + item.materialDate}</Typography>   
                                                <Typography>{ '입고수량: ' + item.materialQty.toLocaleString()}</Typography>
                                                <Typography>{ '입고번호: ' + item.materialNumber }</Typography>    
                                            </Box>
                                        </Box>
                                    ) : (
                                        <Box sx={{display: 'flex'}}>
                                            <KeyboardDoubleArrowDownIcon sx={{color:'red'}} />
                                            <Box sx={{ display: 'flex', gap: 3 }}>
                                                <Typography>{ '품목번호: ' + item.materialNo}</Typography>      
                                                <Typography>{ '품목명: ' + item.materialName}</Typography>    
                                                <Typography>{ '출고일자: ' + item.materialDate}</Typography>   
                                                <Typography>{ '출고수량: ' + item.materialQty.toLocaleString()}</Typography>
                                                <Typography>{ '출고번호: ' + item.materialNumber }</Typography>    
                                            </Box>
                                        </Box>
                                    )}
                                </Card>
                            ))}
                        </Box>
                    </Box>
                    <Box>
                        <Typography sx={{fontSize: 24, fontWeight: 'bold'}}>
                            이번 달 원자재 품목별 입출고수량
                        </Typography>
                        <Box sx={{backgroundColor: 'white', marginTop:1}}>
                            <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={mBarchartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="materialName" />
                                <YAxis tickFormatter={formatNumber}/>
                                <Tooltip formatter={(value: number | string): [string, string] => [formatNumber(value), '수량']} />
                                <Legend />

                                {['inputQty', 'outputQty'].map((key) => (
                                <Bar
                                    key={key}
                                    dataKey={key}
                                    name={key === 'inputQty' ? '입고' : '출고'}
                                    fill={getRandomColor()} // 랜덤 색상
                                >
                                    <LabelList dataKey={key} position="top" formatter={formatLabel} />
                                </Bar>
                                ))}
                            </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Box>
                </Card>
            </Card>
            <Card sx={{width: '50%', padding: 1, gap: 1}}>
                <Card sx={{ padding: 2, backgroundColor: '#ffdf61ff', height: '97%'}}>
                    <Box sx={{height: '50%'}}>
                        <Typography sx={{fontSize: 24, fontWeight: 'bold'}}>
                            원자재 재고현황
                        </Typography>
                        <Box sx={{backgroundColor: 'white', marginTop:1}}>
                            <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={stockData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60} // 도넛 안쪽 구멍 크기
                                    outerRadius={100}
                                    label={(props: PieLabelRenderProps) => {
                                    const value = props.value as number; // value를 number로 단언
                                    return formatNumber(value);          // 숫자 포맷 적용
                                    }}
                                >
                                </Pie>
                                <Tooltip  />
                                <Legend />
                            </PieChart>
                            </ResponsiveContainer>
                        </Box>
                    </Box>
                    <Box>
                        <CommonTable 
                            columns={columns}
                            rows={tableData}
                        />
                    </Box>
                </Card>   
            </Card>
        </Card>
    )
}
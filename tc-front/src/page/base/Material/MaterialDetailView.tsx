import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import CustomBtn from '../../../component/CustomBtn';
import LabelInput from '../../../component/LabelInput';

interface MaterialDataType {
    company_id?: number | string;
    company_name?: string;
    material_no?: string;
    material_name?: string;
    category?: string;
    color?: string;
    spec?: string;
    spec_value?: number | string;
    maker?: string;
    remark?: string;
    is_active?: string;
}

interface DetailProps {
    row: MaterialDataType;
    doCancle: ()=> void;

}

export default function MaterialDetailView({row, doCancle}:DetailProps) {
    const [rowData] = useState<MaterialDataType>(row)

    const handleCancle = () => {
        doCancle()
    }

    return (
        <Box sx={{
            width: '750px',
            height: '550px',
            backgroundColor: 'white',
            
        }}>
            {/* 데이터 입력 폼 */}
            <Box sx={{ width: '700px'}}>
                <Box sx={{display:'flex', justifyContent: 'space-between'}}>
                    <Typography sx={{fontSize: '45px', padding: 2, fontWeight: 'bold'}}>원자재 상세 조회</Typography>
                    {/* 버튼 영역 */}
                    <Box 
                        sx={{ 
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            gap: 2
                        }}
                    >
                        <CustomBtn text='닫기' backgroundColor='gray' onClick={handleCancle} />
                    </Box>
                </Box>
                <Box sx={{ border: '3px solid green', marginLeft: 2, paddingRight: 2, paddingBottom: 2}}>
                    <Box sx={{display: 'flex'}}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, width: '350px', height: '230px', marginTop: '20px'}}>
                            <LabelInput 
                                color='black'
                                labelText='매입처명'
                                value={rowData.company_name}
                                disabled={true}
                            />
                            <LabelInput 
                                color='black'
                                labelText='품목번호'
                                value={rowData.material_no}
                                disabled={true}
                            />
                            <LabelInput 
                                color='black'
                                labelText='분류'
                                value={rowData.category}
                                disabled={true}
                            />
                            <LabelInput 
                                color='black'
                                labelText='규격'
                                value={rowData.spec}
                                disabled={true}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, width: '350px', height: '230px', marginTop: '20px'}}>
                            <LabelInput
                                color='black' 
                                labelText='사용여부'
                                value={rowData.is_active}
                                disabled={true}
                            />
                            <LabelInput 
                                color='black'
                                labelText='품목명'
                                value={rowData.material_name}
                                disabled={true}
                            />
                            <LabelInput 
                                color='black'
                                labelText='색상'
                                value={rowData.color}
                                disabled={true}
                            />
                            <LabelInput 
                                color='black'
                                labelText='제원'
                                value={rowData.spec_value}
                                disabled={true}
                            />
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, marginTop: 1}}>
                        <LabelInput 
                                color='black'
                                labelText='제조사'
                                value={rowData.maker}
                                disabled={true}
                                inputWidth='562px'
                            />
                        <LabelInput 
                            color='black'
                            labelText='비고'
                            value={rowData.remark}
                            disabled={true}
                            inputWidth='562px'
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
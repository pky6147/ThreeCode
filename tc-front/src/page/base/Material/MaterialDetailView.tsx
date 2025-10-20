import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import CustomBtn from '../../../component/CustomBtn';
import LabelInput from '../../../component/LabelInput';

interface MaterialDataType {
    companyName?: string;
    materialNo?: string;
    materialName?: string;
    category?: string;
    color?: string;
    spec?: string;
    specValue?: string;
    maker?: string;
    remark?: string;
    isActive?: string;
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
            width: '800px',
            height: '550px',
            backgroundColor: 'white',
            
        }}>
            {/* 데이터 입력 폼 */}
            <Box sx={{ width: '750px'}}>
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
                        <CustomBtn text='닫기' icon="close" backgroundColor='gray' onClick={handleCancle} />
                    </Box>
                </Box>
                <Box sx={{ border: '3px solid green', marginLeft: 2, paddingRight: 2, paddingBottom: 2}}>
                    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, marginTop: '20px'}}>
                            <LabelInput 
                                color='black'
                                labelText='매입처명'
                                value={rowData.companyName}
                                readOnly={true}
                            />
                            <LabelInput
                                color='black' 
                                labelText='사용여부'
                                value={rowData.isActive}
                                readOnly={true}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, marginTop: '20px'}}>
                            <LabelInput 
                                color='black'
                                labelText='품목번호'
                                value={rowData.materialNo}
                                readOnly={true}
                            />
                            <LabelInput 
                                color='black'
                                labelText='품목명'
                                value={rowData.materialName}
                                readOnly={true}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, marginTop: '20px'}}>
                            <LabelInput 
                                color='black'
                                labelText='분류'
                                value={rowData.category}
                                readOnly={true}
                            />
                            <LabelInput 
                                color='black'
                                labelText='색상'
                                value={rowData.color}
                                readOnly={true}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, marginTop: '20px'}}>
                            <LabelInput 
                                color='black'
                                labelText='규격'
                                value={rowData.spec}
                                readOnly={true}
                            />
                            <LabelInput 
                                color='black'
                                labelText='제원'
                                value={rowData.specValue}
                                readOnly={true}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, marginTop: '20px'}}>
                            <LabelInput 
                                color='black'
                                labelText='제조사'
                                value={rowData.maker}
                                readOnly={true}
                                inputWidth='590px'
                            />                                                            
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, marginTop: '20px'}}>
                            <LabelInput 
                                color='black'
                                labelText='비고'
                                value={rowData.remark}
                                readOnly={true}
                                inputWidth='590px'
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
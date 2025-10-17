import React from 'react'
import {Box, Card} from '@mui/material'
import CustomBtn from './CustomBtn';

interface SearchBarProps {
    children? : React.ReactNode;
    onSearch? : () => void;
    onReset? : () => void;
}

export default function SearchBar({children, onSearch, onReset}: SearchBarProps) {
    return (
        <Card 
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                minHeight: '140px',
                height: '140px',
                backgroundColor: '#1e88e5'
            }}
        >
            {/* 검색조건 영역 */}
            <Box
                sx={{
                    display: 'flex', gap: 2, flexWrap: 'wrap',
                    width: '80%', padding: 2
                }}
            >
                {children}
            </Box>
            {/* 검색/초기화 버튼 영역 */}
            <Box
                sx={{
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', gap: 2,
                    width: '10%', padding: 2
                }}
            >
                <CustomBtn color="" backgroundColor='#0d47a1' text="검색" onClick={onSearch} />
                <CustomBtn color="" backgroundColor='#003c8f' text="초기화" onClick={onReset} />
            </Box>
        </Card>
    )
}
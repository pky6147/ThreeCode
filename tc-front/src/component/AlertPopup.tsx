import { Alert, AlertTitle, Stack } from '@mui/material'

export interface AlertProps {
    type?: 'error' | 'warning' | 'info' | 'success';
    title?: string;
    text?: string;
}

export default function AlertPopup(props: AlertProps) {
    return (
        <Stack sx={{ width:'100%' }} spacing={2}>
            <Alert severity={ props.type || 'success' }>
                <AlertTitle>{props.title || 'title' }</AlertTitle>
                {props.text || 'text 구문을 입력하세요'}
            </Alert>
        </Stack>
    )
}

// 사용하려면 Dialog 안에 담아서 쓰는것을 추천
// type : success, error, info warning
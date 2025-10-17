import { Breadcrumbs, Typography } from "@mui/material"

interface Props {
    text: string;
    subText: string;
}


export default function CustomBC({text, subText}:Props) {
    return (
        <Breadcrumbs sx={{padding: 2, borderBottom: '8px solid #d9ddf0'}}>
            <Typography sx={{ color: 'text.primary' }}>{subText}</Typography>
            <Typography sx={{ color: 'text.primary', fontWeight: 'bold' }}>{text}</Typography>
        </Breadcrumbs>
    )
}
import React from 'react'
import {Box, TextField, Typography} from '@mui/material'

interface LabelInputProps {
    labelText?: string;
    value?: number | string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export default function LabelInput({labelText, value, onChange}: LabelInputProps) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1}}>
            <Typography sx={{
                color: 'white', fontSize: 18, fontWeight: 'bold'
            }}
            >{labelText}</Typography>
            <TextField 
                sx={{backgroundColor: 'white', borderRadius: 1, border: '1px solid'}}
                size="small"
                value={value}
                onChange={onChange}
            />
        </Box>
    )
}
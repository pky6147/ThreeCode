import React from 'react'
import {Box, TextField, Typography} from '@mui/material'

interface LabelInputProps {
    labelText?: string;
    value?: number | string;
    color?: string;
    inputWidth?: string;
    disabled?: boolean
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export default function LabelInput({labelText, value, color, inputWidth, disabled, onChange}: LabelInputProps) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1}}>
            <Typography sx={{
                color: color || 'white', fontSize: 18, fontWeight: 'bold'
            }}
            >{labelText}</Typography>
            <TextField 
                sx={{backgroundColor: 'white', borderRadius: 1, border: '1px solid', width: inputWidth || '230px' }}
                size= "small"
                value={value || ''}
                onChange={onChange}
                disabled={disabled || false}
            />
        </Box>
    )
}
import React from 'react'
import {Box, TextField, Typography} from '@mui/material'

interface LabelInputProps {
    labelText?: string;
    value?: number | string;
    color?: string;
    inputWidth?: string;
    disabled?: boolean;
    required?: boolean;
    placeholder?: string;
    readOnly?: boolean;
    type?: 'text' | 'number';
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export default function LabelInput({labelText, value, color, inputWidth, disabled, required, placeholder, readOnly, type, onChange}: LabelInputProps) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: '320px'}}>
            <Box sx={{ display: 'flex', minWidth: '70px'}}>
                <Typography sx={{ color: color || 'white', fontSize: 18, fontWeight: 'bold', }}>
                    {labelText}                
                </Typography>
                {required && (
                    <Typography sx={{
                        color: 'red', fontSize: 18, fontWeight: 'bold', marginLeft: 0.5
                    }}>
                        *
                    </Typography>
                )}
            </Box>
            <TextField 
                sx={{backgroundColor: 'white', borderRadius: 1, border: '1px solid', width: inputWidth || '246px', minWidth: '246px' }}
                size= "small"
                value={value || ''}
                onChange={onChange}
                disabled={disabled || false}
                placeholder={placeholder || ''}
                inputProps={{ autoFocus: true }}
                slotProps={{
                    input: {
                      readOnly: readOnly || false
                    },
                }}
                type={type || 'text'}
            />
        </Box>
    )
}
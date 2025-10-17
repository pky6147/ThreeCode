import {
    Box, 
    Typography,
    FormControl,
    MenuItem,
    Select
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'

interface LabelSelectProps {
    // Label
    labelText?: string;
    color?: string;
    // SelectBox
    value?: string;
    onChange?: (event: SelectChangeEvent<string>) => void;
    options: { id: string; name: string}[];
    disabled?: boolean
}

export default function LabelSelect({labelText, color, value,  onChange, options, disabled}: LabelSelectProps) {

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: '320px'}}>
            <Typography sx={{
                color: color || 'white', fontSize: 18, fontWeight: 'bold', minWidth: '70px'
            }}
            >{labelText}</Typography>
            <FormControl sx={{width: '246px', height: '40px', minWidth: '246px'}}>
                <Select
                    onChange={onChange}
                    value={value || ''}
                    sx={{ height: '100%', backgroundColor: 'white'}}
                    disabled={disabled || false}
                >
                    {options.map(opt => (
                        <MenuItem key={opt.id} value={opt.id}>
                            {opt.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    )
}